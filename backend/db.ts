import { connect } from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/apartments';
if (!uri) {
  console.error('MONGO_URI not set');
  process.exit(1);
}

main().catch((err) => console.log(err));

async function main() {
  connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.log('MongoDB connection error:', err);
      process.exit(1);
    });
}
