// Types for the food delivery application

export interface MenuItem {
  id: number
  name: string
  price: string
  description: string
  image: string
  hot?: boolean
  deal?: boolean
  category?: 'burger' | 'fries' | 'drink' | 'dessert'
}

export interface Deal {
  id: number
  title: string
  description: string
  discount: string
  image: string
  expires?: Date
}

export interface ContactInfo {
  type: 'phone' | 'email' | 'whatsapp' | 'address'
  label: string
  value: string
}

export interface OrderItem {
  itemId: number
  quantity: number
  specialInstructions?: string
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: OrderItem[]
  totalPrice: number
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'completed'
  createdAt: Date
  estimatedDelivery?: Date
}
