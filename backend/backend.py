from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime


######### CONFIG #########
app = Flask(__name__)
CORS(app)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@127.0.0.1:3306/restops'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://myuser:mypass@192.168.122.90:3306/restops'
db = SQLAlchemy(app)


######### MODELS #########
class OrderItems(db.Model):
	__tablename__ = 'order_items'

	# order_item_id = db.Column(db.Integer, primary_key=True)
	# order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
	# item_id = db.Column(db.Integer, db.ForeignKey('items.item_id'))
	# price = db.Column(db.Float, db.ForeignKey('items.price'))

	order_item_id = db.Column(db.Integer, primary_key=True)
	order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
	item_id = db.Column(db.String(100), nullable=False)
	name = db.Column(db.String(100), nullable=False)
	price = db.Column(db.Float, nullable=False)

	def __init__(self, order_id, item_id, name, price):
		# self.order_item_id = order_item_id
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
# class Taxes(db.Model):
# 	__tablename__ = 'taxes'

# 	tax_id = db.Column(db.Integer, primary_key=True)
# 	order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
# 	tax_amount = db.Column(db.Numeric(2, 10))

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










	

	# if request.method == 'POST':
	# 	# get data from json data and put into local vars
	# 	item_id = request_data['id']
	# 	name = request_data['name']
	# 	price = request_data['price']
	# 	print(request_data)
	# 	updated_msg = f'The database has been updated with {name} as the name and {price} as the price.'

	# 	# create new Food entry from local vars
	# 	menu_item = Items(item_id, name, price)

	# 	# intitializes table
	# 	db.create_all()
		
	# 	# commit entry to database
	# 	db.session.add(menu_item)
	# 	db.session.commit()

	# 	return render_template('flask.html', msg=updated_msg)
	# else:
	# 	return render_template('flask.html', msg='This is a GET')



if __name__ == '__main__':
	# app.run(debug=True, host='0.0.0.0')
	app.run(debug=True)