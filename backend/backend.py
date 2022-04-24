from flask import Flask, redirect, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import stripe
from flask_socketio import SocketIO, send, emit
import eventlet



######### CONFIG #########
app = Flask(__name__)
CORS(app)
# socketio = SocketIO(app, cors_allowed_origins="*")
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://tom:restops123@192.168.122.90:3306/restops'
app.config['STRIPE_PUBLIC_KEY'] = 'pk_test_51KLWJVKyPdTxxYmH5qLhJotolMRrp5YzvR4Vn2csRCunIaXnxQxfd7PK3amQGi6RHdl9Xx966Bjas1HlDH0B9A7N00MjcbjqJX'
app.config['STRIPE_SECRET_KEY'] =  'sk_test_51KLWJVKyPdTxxYmHvxC7eClx0BOrw9BmEiLxiQxKQwO2W1pGigCofwdYRnjcdccNGODtmxUhq13HPgfnUTBfNakf00ysceqLkE'

db = SQLAlchemy(app)

STRIPE_PUBLIC_KEY = 'pk_test_51KLWJVKyPdTxxYmH5qLhJotolMRrp5YzvR4Vn2csRCunIaXnxQxfd7PK3amQGi6RHdl9Xx966Bjas1HlDH0B9A7N00MjcbjqJX'
# stripw_account = 'acct_1KLWJVKyPdTxxYmH'
stripe.api_key = app.config['STRIPE_SECRET_KEY']
WEBHOOK_SECRET = 'whsec_1085cd4ee6ad114505bff0f0241f03665fe4defb002a0ef8599ffb342728de82'
FRONT_DOMAIN = 'http://localhost:4200'


######### MODELS #########
class OrdersInProgress(db.Model):
	__tablename__ = 'orders_in_progress'

	checkout_id = db.Column(db.String(100), primary_key=True)
	order_time = db.Column(db.DateTime)

	def __init__(self, checkout_id, order_time):
		self.checkout_id = checkout_id
		self.order_time = order_time

	def __repr__(self):
		return f'{self.checkout_id}, {self.order_time}'

class OrderItemsInProgress(db.Model):
	__tablename__ = 'order_items_in_progress'


	order_item_id = db.Column(db.Integer, primary_key=True)
	price_id = db.Column(db.String(100), nullable=False)
	checkout_id = db.Column(db.String(100), db.ForeignKey('orders_in_progress.checkout_id'))
	name = db.Column(db.String(100), nullable=False)
	quantity = db.Column(db.Integer, nullable=False)

	def __init__(self, price_id, checkout_id, name, quantity):
		self.price_id = price_id
		self.checkout_id = checkout_id
		self.name = name
		self.quantity = quantity


class Test(db.Model):
	__tablename__ = 'test'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(200))

	def __init__(self, name):
		self.name = name

	def __repr__(self):
		return f'Id: {self.id}, Name: {self.name}'


######### APIs #########
@app.route('/api/create-checkout-session', methods=['POST', 'GET'])
def createCheckoutSession():
	request_data = request.get_json()

	line_items_input = []
	for i in request_data:
		line_items_input.append({'price': i['price_id'], 'quantity': i['quantity']})


	checkout_session = stripe.checkout.Session.create(
		line_items=line_items_input,
		mode='payment',
		success_url= FRONT_DOMAIN + '/handler/success-checkout',
		cancel_url= FRONT_DOMAIN + '/handler/failure-checkout',
	)

	return checkout_session.url


@app.route('/api/webhook', methods=['POST'])
def webhook():
	event = None
	payload = request.data
	sig_header = request.headers['STRIPE_SIGNATURE']

	with open("MY_LOG.txt", "w") as text_file:
		text_file.write(str(payload))

	if request.method == 'POST':
		try:
			event = stripe.Webhook.construct_event(
				payload, sig_header, WEBHOOK_SECRET
			)
		except ValueError as e:
			# Invalid payload
			raise e
		except stripe.error.SignatureVerificationError as e:
			# Invalid signature
			raise e


		# Handle the event
		if event['type'] == 'checkout.session.completed':
			try:
				print(event)
			except:
				print('COULD NOT PRINT EVENT')


			chkout_session_id = event['data']['object']['id']
			print(chkout_session_id)

			# use only to initialize tables
			#db.create_all()
			
			# Initialize the order in progress and add it to the table in mysql db
			order_entry = OrdersInProgress(chkout_session_id, datetime.now())
			db.session.add(order_entry)
			db.session.commit()

			# Gets the order items/food from the checkout session data
			# In this case, what Stripe calls line items is what we call order items
			line_items_object = stripe.checkout.Session.list_line_items(chkout_session_id)
			print(line_items_object)
			line_items_array = line_items_object['data']

			# initialize the order data to be sent over WebSocket via Socket.Io
			ioOrder = {
				'order_id': chkout_session_id,
				'items_list': []
			}

			# adds every line item to the items_list array in the ioOrder dict
			for i in line_items_array:
				print(i['price'])
				print(i['price']['id'])
				item = {}

				order_items_content = OrderItemsInProgress(
					i['price']['id'],    # price id
					chkout_session_id,    # checkout session id
					i['description'],    # name
					i['quantity']        # quantity
				)
				db.session.add(order_items_content)


				item['id'] = i['price']['id']
				item['name'] = i['description']
				item['quantity'] = i['quantity']

				ioOrder['items_list'].append(item)
			
			db.session.commit()
			
			# emits the ioOrder data to kitchen.component.ts on the newOrder event name
			socketio.emit("newOrder", ioOrder)


		# handle other event types
		else:
			print('Unhandled event type {}'.format(event['type']))

		# redirects to the success page
		return jsonify(success=True)


@app.route('/api/mark-order-complete', methods=['POST'])
def completeOrder():
	request_data = request.get_json()
	print(request_data['order_id'])
	print(request_data['items_list'])

	l_order_id = request_data['order_id']

	OrderItemsInProgress.query.filter_by(checkout_id=l_order_id).delete()
	db.session.commit()

	OrdersInProgress.query.filter_by(checkout_id=l_order_id).delete()
	db.session.commit()


	return jsonify("ORDER HAS BEEN MARKED AS COMPLETED")



######### TEMPLATES #########
# @app.route("/success")
# def success():
# 	return render_template('success.html')


# @app.route("/cancel")
# def cancel():
# 	return render_template('cancel.html')



######### WEBSOCKET #########
@socketio.on('connect')
def connect():
	print("EMITTING")

	array_of_objects = []

	orders = OrdersInProgress.query.all()
	print(orders)
	for order in orders:
		order_obj = {}
		order_obj['order_id'] = order.checkout_id
		items_list = []

		order_items = OrderItemsInProgress.query.filter_by(checkout_id=order.checkout_id)
		for i in order_items:
			item = {}
			item['id'] = i.price_id
			item['name'] = i.name
			item['quantity'] = i.quantity
			items_list.append(item)
		
		order_obj['items_list'] = items_list
		array_of_objects.append(order_obj)


	emit('connect', array_of_objects)



if __name__ == '__main__':
	# app.run(debug=True, host='0.0.0.0')
	# app.run(debug=True, port=4242)
	socketio.run(app, debug=True, port=4242)
