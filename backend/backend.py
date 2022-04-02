
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import stripe



######### CONFIG #########
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:pass@192.168.122.90:3306/restops'
app.config['STRIPE_SECRET_KEY'] =  'sk_test_51KLWJVKyPdTxxYmHvxC7eClx0BOrw9BmEiLxiQxKQwO2W1pGigCofwdYRnjcdccNGODtmxUhq13HPgfnUTBfNakf00ysceqLkE'
CORS(app)

db = SQLAlchemy(app)

stripe.api_key = 'sk_test_51KLWJVKyPdTxxYmHvxC7eClx0BOrw9BmEiLxiQxKQwO2W1pGigCofwdYRnjcdccNGODtmxUhq13HPgfnUTBfNakf00ysceqLkE'
STRIPE_PUBLIC_KEY = 'pk_test_51KLWJVKyPdTxxYmH5qLhJotolMRrp5YzvR4Vn2csRCunIaXnxQxfd7PK3amQGi6RHdl9Xx966Bjas1HlDH0B9A7N00MjcbjqJX'

strip_account = 'acct_1KLWJVKyPdTxxYmH'


######### MODELS #########
class OrderItems(db.Model):
	__tablename__ = 'order_items'

	order_item_id = db.Column(db.Integer, primary_key=True)
	order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
	item_id = db.Column(db.String(100), nullable=False)
	name = db.Column(db.String(100), nullable=False)
	price = db.Column(db.Float, nullable=False)

	def __init__(self, order_id, item_id, name, price):
		self.order_id = order_id
		self.item_id = item_id
		self.name = name
		self.price = price

class Orders(db.Model):
	__tablename__ = 'orders'

	order_id = db.Column(db.Integer, primary_key=True)
	order_time = db.Column(db.DateTime)

	def __init__(self, order_time):
		self.order_time = order_time

	def __repr__(self):
		return f'{self.order_id}, {self.order_time}'

class Items(db.Model):
	__tablename__ = 'items'

	item_id = db.Column(db.String(100), primary_key=True)
	name = db.Column(db.String(100), nullable=False)
	price = db.Column(db.Numeric(2, 10), nullable=False)

	def __init__(self, item_id, name, price):
		self.item_id = item_id
		self.name = name
		self.price = price


######### APIs #########
@app.route('/', methods=['POST', 'GET'])
def cart():
	"""
	get request data from Angular
	file = customer.component.ts
	method = submitToBackend()
	"""
	request_data = request.get_json()


	if request.method == 'POST':
		if request_data is not None:
			"""
			We must first initialize the order in the 'orders' table on the
			mysql db. Then we retrieve the 'order_id' that was generated for
			the current order. We must do this instead of creating the 'order_id'
			on the backend because the 'order_id' is auto_incremented
			"""
			# use only to initialize tables
			#db.create_all()

			# initialize the order and add it to the 'orders' table in mysql db
			order_entry = Orders(datetime.now())
			db.session.add(order_entry)
			db.session.commit()

			# get the 'order_id' from the database
			current_order = Orders.query.order_by(Orders.order_id.desc()).first()
			current_order_id = current_order.order_id
			#print(current_order_id.order_id)

			for i in request_data:
				order_content = OrderItems(
					current_order_id,	# order_id
					i['id'],			# item_id
					i['name'],			# name
					i['price'])			# price
				db.session.add(order_content)
			
			db.session.commit()

		return render_template('flask.html', msg=request_data)
	else:
		return render_template('flask.html', msg='This is a GET')


@app.route('/api/public-key')
def publicKey():
	return jsonify( {'key':STRIPE_PUBLIC_KEY} )


if __name__ == '__main__':
	# app.run(debug=True, host='0.0.0.0')
	app.run(debug=True)