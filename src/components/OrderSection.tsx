
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, MinusCircle, PlusCircle } from "lucide-react";

// Import product data
import { products } from "./ProductData";

interface OrderItem {
  product: string;
  quantity: number;
}

const OrderSection = () => {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ product: "", quantity: 1 }]);

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product: "", quantity: 1 }]);
  };

  const removeOrderItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !phone || !address) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!orderItems.some(item => item.product && item.quantity > 0)) {
      toast({
        title: "No Products Selected",
        description: "Please add at least one product to your order.",
        variant: "destructive",
      });
      return;
    }

    // Submit success
    toast({
      title: "Order Submitted!",
      description: "Your order request has been submitted. We'll contact you shortly.",
    });

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setOrderItems([{ product: "", quantity: 1 }]);
  };

  return (
    <section id="order" className="section-padding bg-charcoal bg-[url('https://images.unsplash.com/photo-1505588568023-83c0163aa723?q=80&w=2071')] bg-fixed bg-cover bg-center relative">
      <div className="absolute inset-0 bg-charcoal-dark/90" />
      
      <div className="container relative z-10">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Place Your <span className="text-gradient">Order</span>
          </h2>
          <p className="text-white/70 max-w-2xl">
            Interested in our premium steel furniture? Fill out the form below and our team will contact you shortly with pricing and delivery information.
          </p>
        </div>

        <div className="max-w-3xl mx-auto glass-card rounded-md p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-charcoal-light/50 border-white/10"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-charcoal-light/50 border-white/10"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-charcoal-light/50 border-white/10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea 
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-charcoal-light/50 border-white/10 min-h-[80px]"
                  placeholder="Your complete shipping address"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Products</h3>
                <Button 
                  type="button" 
                  onClick={addOrderItem} 
                  variant="outline" 
                  size="sm"
                  className="border-burntOrange text-burntOrange hover:bg-burntOrange hover:text-white"
                >
                  Add Product
                </Button>
              </div>

              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="p-4 border border-white/10 rounded-md bg-charcoal-dark/50">
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="grow">
                        <Label htmlFor={`product-${index}`}>Select Product</Label>
                        <Select
                          value={item.product}
                          onValueChange={(value) => updateOrderItem(index, "product", value)}
                        >
                          <SelectTrigger className="bg-charcoal-light/50 border-white/10 mt-1">
                            <SelectValue placeholder="Choose a product" />
                          </SelectTrigger>
                          <SelectContent className="bg-charcoal border border-white/10">
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} ({product.itemCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="w-32">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <div className="flex items-center mt-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateOrderItem(index, "quantity", item.quantity - 1)
                              }
                            }}
                            className="h-8 w-8 text-white/70"
                          >
                            <MinusCircle size={16} />
                          </Button>
                          
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(index, "quantity", parseInt(e.target.value) || 1)}
                            className="h-8 bg-charcoal-light/50 border-white/10 text-center"
                          />
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => updateOrderItem(index, "quantity", item.quantity + 1)}
                            className="h-8 w-8 text-white/70"
                          >
                            <PlusCircle size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      {orderItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                          className="text-white/70 hover:text-white hover:bg-red-900/20"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-burntOrange hover:bg-burntOrange/90 text-white"
            >
              Submit Order Request
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
