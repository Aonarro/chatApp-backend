import mongoose from 'mongoose'

export default mongoose
	.connect('mongodb://mongoadmin:12345@localhost:27017/chatApp_DB', {
		authSource: 'admin',
	})
	.then(() => console.log('Connected To Database'))
	.catch((err) => console.log('Error: ', err))
