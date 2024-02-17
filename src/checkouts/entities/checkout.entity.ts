import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type CreateCheckoutCommand = {
  items: {
    quantity: number;
    price: number;
    product: {
      name: string;
      description: string;
      image_url: string;
      product_id: number;
    };
  }[];
};

enum CheckoutStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public total: number;

  @Column()
  public status: CheckoutStatus = CheckoutStatus.Pending;

  @CreateDateColumn()
  public created_at: Date;

  @OneToMany(() => CheckoutItem, (item) => item.checkout, {
    cascade: ['insert'],
    eager: true,
  })
  items: CheckoutItem[];

  public static create(input: CreateCheckoutCommand): Checkout {
    const checkout = new Checkout();

    checkout.items = input.items.map((item) => {
      const checkoutItem = new CheckoutItem();

      checkoutItem.quantity = item.quantity;
      checkoutItem.price = item.price;

      checkoutItem.product = new CheckoutProduct();
      checkoutItem.product.name = item.product.name;
      checkoutItem.product.image_url = item.product.image_url;
      checkoutItem.product.product_id = item.product.product_id;

      return checkoutItem;
    });

    checkout.total = checkout.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return checkout;
  }

  public pay() {
    if (this.status === CheckoutStatus.Completed) {
      throw new Error('Checkout already completed');
    }

    if (this.status === CheckoutStatus.Canceled) {
      throw new Error('Checkout already canceled');
    }

    this.status = CheckoutStatus.Completed;
  }

  public cancel() {
    if (this.status === CheckoutStatus.Canceled) {
      throw new Error('Checkout already canceled');
    }
    if (this.status === CheckoutStatus.Completed) {
      throw new Error('Checkout already completed');
    }

    this.status = CheckoutStatus.Canceled;
  }
}

@Entity()
export class CheckoutProduct {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public name: string;

  @Column()
  public image_url: string;

  @Column()
  public product_id: number; // This is the product id from the external service
}

@Entity()
export class CheckoutItem {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public price: number;

  @Column()
  public quantity: number;

  @ManyToOne(() => Checkout)
  public checkout: Checkout;

  @ManyToOne(() => CheckoutProduct, { cascade: ['insert'], eager: true })
  public product: CheckoutProduct;
}
