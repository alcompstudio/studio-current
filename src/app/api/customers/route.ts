import { NextResponse, NextRequest } from 'next/server'; // Import NextRequest
import { Customer } from '@/lib/db'; // Import Customer from db

export async function GET(request: NextRequest) { // Add request parameter
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  try {
    if (email) {
      // Если email предоставлен, ищем конкретного клиента
      console.log(`[API_CUSTOMERS_GET] Searching for customer with email: ${email}`);
      const customer = await Customer.findOne({ where: { email: email } });
      if (!customer) {
        console.log(`[API_CUSTOMERS_GET] Customer not found for email: ${email}`);
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
      console.log(`[API_CUSTOMERS_GET] Customer found:`, customer);
      return NextResponse.json(customer); // Возвращаем одного клиента
    } else {
      // Если email не предоставлен, возвращаем всех клиентов
      console.log(`[API_CUSTOMERS_GET] Fetching all customers`);
      const customers = await Customer.findAll();
      return NextResponse.json(customers);
    }
  } catch (error) {
    console.error('[API_CUSTOMERS_GET] Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const customerData = await request.json();
    const customer = await Customer.create(customerData);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...customerData } = await request.json();
    const [updated] = await Customer.update(customerData, { where: { id } });
    if (!updated) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const deleted = await Customer.destroy({ where: { id } });
    if (!deleted) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}