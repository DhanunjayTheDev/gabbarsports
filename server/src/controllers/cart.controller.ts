import { Request, Response, NextFunction } from 'express'
import Cart from '../models/Cart'
import Product from '../models/Product'
import { sendSuccess, AppError } from '../utils/response'

export async function getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cart = await Cart.findOne({ user: req.user!._id }).populate('items.product', 'name thumbnail price isActive')
    sendSuccess(res, { data: cart || { items: [] } })
  } catch (err) {
    next(err)
  }
}

export async function addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, variantId, quantity = 1 } = req.body
    const userId = req.user!._id

    const product = await Product.findById(productId)
    if (!product || !product.isActive) throw new AppError('Product not available', 400)

    let price = product.price
    let stockQuantity = product.stockQuantity

    if (variantId) {
      const variant = (product.variants as any).id(variantId)
      if (!variant) throw new AppError('Variant not found', 400)
      price = variant.price
      stockQuantity = variant.stockQuantity
    }

    if (stockQuantity < quantity) throw new AppError('Insufficient stock', 400)

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] })
    }

    const key = `${productId}-${variantId || ''}`
    const existingIdx = cart.items.findIndex(
      (i: any) => i.product.toString() === productId && (i.variant?.toString() || '') === (variantId || '')
    )

    if (existingIdx >= 0) {
      const newQty = cart.items[existingIdx].quantity + quantity
      if (newQty > stockQuantity) throw new AppError('Insufficient stock', 400)
      cart.items[existingIdx].quantity = newQty
    } else {
      cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price,
        name: product.name,
        image: product.thumbnail,
        sku: product.sku,
      })
    }

    await cart.save()
    sendSuccess(res, { message: 'Added to cart', data: cart })
  } catch (err) {
    next(err)
  }
}

export async function updateCartItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { itemId } = req.params
    const { quantity } = req.body

    const cart = await Cart.findOne({ user: req.user!._id })
    if (!cart) throw new AppError('Cart not found', 404)

    const item = (cart.items as any).id(itemId)
    if (!item) throw new AppError('Item not found', 404)

    if (quantity <= 0) {
      ;(cart.items as any).pull(itemId)
    } else {
      item.quantity = quantity
    }

    await cart.save()
    sendSuccess(res, { message: 'Cart updated', data: cart })
  } catch (err) {
    next(err)
  }
}

export async function removeFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user!._id })
    if (!cart) throw new AppError('Cart not found', 404)

    ;(cart.items as any).pull(itemId)
    await cart.save()
    sendSuccess(res, { message: 'Item removed', data: cart })
  } catch (err) {
    next(err)
  }
}

export async function clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await Cart.findOneAndUpdate({ user: req.user!._id }, { items: [] })
    sendSuccess(res, { message: 'Cart cleared' })
  } catch (err) {
    next(err)
  }
}
