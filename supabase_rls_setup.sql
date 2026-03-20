/* 
  RAJ ELECTRONICS: SUPABASE RLS POLICIES
  Run this SQL in your Supabase SQL Editor (Dashboard -> SQL Editor)
  to harden your database for real orders.
*/

-- 1. Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

-- 2. USER PROFILE POLICY
-- Users can only read/update their own profile
CREATE POLICY "Users can only see their own profile" 
ON "User" 
FOR SELECT 
USING (id = (SELECT "id" FROM "User" WHERE phone = auth.jwt()->>'phone_number' LIMIT 1));

CREATE POLICY "Users can update their own profile" 
ON "User" 
FOR UPDATE 
USING (id = (SELECT "id" FROM "User" WHERE phone = auth.jwt()->>'phone_number' LIMIT 1));

-- 3. ORDERS POLICY
-- Users can only see their own orders
CREATE POLICY "Users can only see their own orders" 
ON "Order" 
FOR SELECT 
USING ("userId" = (SELECT "id" FROM "User" WHERE phone = auth.jwt()->>'phone_number' LIMIT 1));

-- 4. ADDRESS POLICY
-- Users can manage their own delivery addresses
CREATE POLICY "Users can manage their own addresses" 
ON "Address" 
ALL 
USING ("userId" = (SELECT "id" FROM "User" WHERE phone = auth.jwt()->>'phone_number' LIMIT 1));

-- 5. ORDER ITEMS POLICY
-- Indirect access through orders
CREATE POLICY "Users can see items of their own orders" 
ON "OrderItem" 
FOR SELECT 
USING ("orderId" IN (
    SELECT id FROM "Order" 
    WHERE "userId" = (SELECT "id" FROM "User" WHERE phone = auth.jwt()->>'phone_number' LIMIT 1)
));

-- 6. ADMIN BYPASS (Optional)
-- If you use a specific ID or role for admin, add it here.
