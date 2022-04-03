from crypt import methods
from email.policy import default
from flask import Flask, redirect, render_template, request, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import stripe
import json
import os

######### CONFIG #########
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://tom:Jkll233-=@192.168.122.90:3306/restops'
app.config['STRIPE_PUBLIC_KEY'] = 'pk_test_51KLWJVKyPdTxxYmH5qLhJotolMRrp5YzvR4Vn2csRCunIaXnxQxfd7PK3amQGi6RHdl9Xx966Bjas1HlDH0B9A7N00MjcbjqJX'
app.config['STRIPE_SECRET_KEY'] =  'sk_test_51KLWJVKyPdTxxYmHvxC7eClx0BOrw9BmEiLxiQxKQwO2W1pGigCofwdYRnjcdccNGODtmxUhq13HPgfnUTBfNakf00ysceqLkE'


db = SQLAlchemy(app)

# strip_account = 'acct_1KLWJVKyPdTxxYmH'
stripe.api_key = app.config['STRIPE_SECRET_KEY']
WEBHOOK_SECRET = 'whsec_1085cd4ee6ad114505bff0f0241f03665fe4defb002a0ef8599ffb342728de82'
DOMAIN = 'http://localhost:4242'


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


######### APIs #########
# @app.route('/', methods=['POST', 'GET'])
# def cart():
# 	"""
# 	get request data from Angular
# 	file = customer.component.ts
# 	method = submitToBackend()
# 	"""
# 	request_data = request.get_json()

# 	if request.method == 'POST':
# 		if request_data is not None:
# 			"""
# 			We must first initialize the order in the 'orders' table on the
# 			mysql db. Then we retrieve the 'order_id' that was generated for
# 			the current order. We must do this instead of creating the 'order_id'
# 			on the backend because the 'order_id' is auto_incremented
# 			"""
# 			# use only to initialize tables
# 			#db.create_all()

# 			# initialize the order and add it to the 'orders' table in mysql db
# 			order_entry = Orders(datetime.now())
# 			db.session.add(order_entry)
# 			db.session.commit()

# 			# get the 'order_id' from the database
# 			current_order = Orders.query.order_by(Orders.order_id.desc()).first()
# 			current_order_id = current_order.order_id
# 			#print(current_order_id.order_id)

# 			for i in request_data:
# 				order_content = OrderItems(
# 					current_order_id,	# order_id
# 					i['id'],			# item_id
# 					i['name'],			# name
# 					i['price'])			# price
# 				db.session.add(order_content)
			
# 			db.session.commit()

# 		return render_template('flask.html', msg=request_data)
# 	else:
# 		return render_template('flask.html', msg='This is a GET')



@app.route('/api/create-checkout-session', methods=['POST', 'GET'])
def createCheckoutSession():
	request_data = request.get_json()

	line_items_input = []
	for i in request_data:
		line_items_input.append({'price': i['price_id'], 'quantity': i['quantity']})


	checkout_session = stripe.checkout.Session.create(
		line_items=line_items_input,
		mode='payment',
		success_url= DOMAIN + '/success',
		cancel_url= DOMAIN + '/cancel',
	)

	# return redirect(checkout_session.url, code=303)
	return checkout_session.url


@app.route('/api/webhook', methods=['POST'])
def webhook():
	# stripe_payload = request.json
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

			#session = event['data']['object']
			chkout_session_id = event['data']['object']['id']
			print(chkout_session_id)

			# use only to initialize tables
			#db.create_all()
			
			# initialize the order in progress and add it to the table in mysql db
			order_entry = OrdersInProgress(chkout_session_id, datetime.now())
			db.session.add(order_entry)
			db.session.commit()


			line_items_object = stripe.checkout.Session.list_line_items(chkout_session_id)
			print(line_items_object)
			line_items_array = line_items_object['data']

			#print(current_order_id.order_id)

			for i in line_items_array:
				# price_id = i['price']['id']
				print(i['price'])
				print(i['price']['id'])

				order_items_content = OrderItemsInProgress(
					i['price']['id'],	# price id
					chkout_session_id,	# checkout session id
					i['description'],	# name
					i['quantity']		# quantity
				)
				db.session.add(order_items_content)
			
			db.session.commit()



		# handle other event types
		else:
			print('Unhandled event type {}'.format(event['type']))

		return jsonify(success=True)


# @app.route('/api/add-order-to-kitchen', methods=['POST', 'GET'])
# def addOrder():
# 	request_data = request.get_json()
# 	return request_data


@app.route("/success")
def success():
	return render_template('success.html')


@app.route("/cancel")
def cancel():
	return render_template('cancel.html')



if __name__ == '__main__':
	# app.run(debug=True, host='0.0.0.0')
	app.run(debug=True, port=4242)


