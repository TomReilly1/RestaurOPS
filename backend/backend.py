from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


######### CONFIG #########
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@127.0.0.1:3306/restops'
db = SQLAlchemy(app)


######### MODELS #########
class Food(db.Model):
	__tablename__ = 'food_orders'

	name = db.Column(db.String(100), primary_key=True)
	price = db.Column(db.Float, nullable=False)

	def __init__(self, name, price):
		self.name = name
		self.price = price


######### APIs #########
@app.route('/', methods=['POST', 'GET'])
def cart():
	request_data = request.get_json()
	print(request_data)

	if request.method == 'POST':
		# get data from json data and put into local vars
		name = request_data['name']
		price = request_data['price']
		print(request_data)
		updated_msg = f'The database has been updated with {name} as the name and {price} as the price.'

		# create new Food entry from local vars
		menu_item = Food(name, price)

		# commit entry to database
		# db.create_all() --only used for intialization
		db.session.add(menu_item)
		db.session.commit()

		return render_template('flask.html', msg=updated_msg)
	else:
		return render_template('flask.html', msg='This is a GET')



if __name__ == '__main__':
	# app.run(debug=True, host='0.0.0.0')
	app.run(debug=True)