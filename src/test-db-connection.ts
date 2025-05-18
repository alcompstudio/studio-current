import { connectDB } from './lib/db';

async function testConnection() {
  console.log('Attempting to connect to the database...');
  await connectDB();
  // Если connectDB не выбрасывает ошибку, соединение успешно.
  // Сообщение об успехе или ошибке будет выведено из самой функции connectDB.
}

testConnection().catch(error => {
  console.error('An unexpected error occurred during the connection test:', error);
});