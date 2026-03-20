import prisma from './prisma';

export async function findOrCreateUser(phone: string, name?: string, email?: string) {
  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ 
      data: { phone, name, email } 
    });
  } else {
    // Update name and email if they weren't set before
    const dataToUpdate: any = {};
    if (name && !user.name) dataToUpdate.name = name;
    if (email && !user.email) dataToUpdate.email = email;
    
    if (Object.keys(dataToUpdate).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: dataToUpdate
      });
    }
  }
  return user;
}

export async function createOrGetAddress(userId: string, addressData: any) {
  // Try to find if this exact address exists to avoid duplicates
  const existing = await prisma.address.findFirst({
    where: {
      userId,
      street: addressData.street,
      area: addressData.area,
      pin: addressData.pin,
      email: addressData.email
    }
  });

  if (existing) return existing;

  return await prisma.address.create({
    data: {
      userId,
      name: addressData.name,
      phone: addressData.phone,
      email: addressData.email,
      street: addressData.street,
      area: addressData.area,
      pin: addressData.pin
    }
  });
}

export async function getOrderWithDetails(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });
}
