import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  brand: string;
  stock: boolean;
  discount?: number;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const products: Product[] = [
    { id: 1, name: 'Тормозные колодки', category: 'brakes', price: 3500, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/3e49715f-e2c0-4381-b926-8f27dba2e7d3.jpg', brand: 'Brembo', stock: true, discount: 15 },
    { id: 2, name: 'Масляный фильтр', category: 'filters', price: 450, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/da726a92-fe29-4088-a9f0-19e7f87232c6.jpg', brand: 'Mann', stock: true },
    { id: 3, name: 'Комплект двигателя', category: 'engine', price: 25000, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/0a7b622b-0ffc-4240-881b-95d78761629d.jpg', brand: 'Bosch', stock: true, discount: 20 },
    { id: 4, name: 'Воздушный фильтр', category: 'filters', price: 550, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/da726a92-fe29-4088-a9f0-19e7f87232c6.jpg', brand: 'Mann', stock: true },
    { id: 5, name: 'Тормозные диски', category: 'brakes', price: 5200, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/3e49715f-e2c0-4381-b926-8f27dba2e7d3.jpg', brand: 'Brembo', stock: true },
    { id: 6, name: 'Свечи зажигания', category: 'engine', price: 800, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/0a7b622b-0ffc-4240-881b-95d78761629d.jpg', brand: 'NGK', stock: false },
  ];

  const categories = [
    { id: 'all', name: 'Все категории', icon: 'Grid3x3' },
    { id: 'brakes', name: 'Тормозная система', icon: 'Disc' },
    { id: 'engine', name: 'Двигатель', icon: 'Cog' },
    { id: 'filters', name: 'Фильтры', icon: 'Filter' },
  ];

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: 'Добавлено в корзину',
      description: `${product.name} добавлен в корзину`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedBrand === 'all' || product.category === selectedBrand;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Car" className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-heading font-bold text-foreground">AutoParts PRO</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#catalog" className="text-muted-foreground hover:text-primary transition-colors">Каталог</a>
              <a href="#selection" className="text-muted-foreground hover:text-primary transition-colors">Подбор</a>
              <a href="#delivery" className="text-muted-foreground hover:text-primary transition-colors">Доставка</a>
              <a href="#contacts" className="text-muted-foreground hover:text-primary transition-colors">Контакты</a>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" className="w-5 h-5" />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="font-heading">Корзина покупок</SheetTitle>
                  <SheetDescription>
                    {cart.length === 0 ? 'Ваша корзина пуста' : `Товаров в корзине: ${cart.length}`}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="animate-scale-in">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.brand}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" className="w-3 h-3" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-6 w-6 ml-auto"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Trash2" className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{(item.discount ? item.price * (1 - item.discount / 100) : item.price).toLocaleString()} ₽</p>
                            {item.discount && (
                              <p className="text-xs text-muted-foreground line-through">{item.price.toLocaleString()} ₽</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center text-lg font-heading font-bold">
                      <span>Итого:</span>
                      <span className="text-primary">{getTotalPrice().toLocaleString()} ₽</span>
                    </div>
                    <Button className="w-full" size="lg">
                      Оформить заказ
                      <Icon name="ArrowRight" className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-br from-background via-background to-muted py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-foreground">
              Автозапчасти для вашего автомобиля
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Оригинальные запчасти от проверенных производителей с гарантией качества
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg">
                <Icon name="Search" className="mr-2 w-5 h-5" />
                Подобрать запчасти
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                <Icon name="Phone" className="mr-2 w-5 h-5" />
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="selection" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-heading font-bold text-center mb-8 text-foreground">Подбор по автомобилю</h3>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="font-heading">Найдите запчасти для вашего авто</CardTitle>
              <CardDescription>Выберите марку и модель автомобиля</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Марка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все марки</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  <SelectItem value="volkswagen">Volkswagen</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Модель" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все модели</SelectItem>
                  <SelectItem value="camry">Camry</SelectItem>
                  <SelectItem value="corolla">Corolla</SelectItem>
                  <SelectItem value="rav4">RAV4</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">
                <Icon name="Search" className="mr-2 w-4 h-4" />
                Найти запчасти
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-heading font-bold text-center mb-12 text-foreground">Каталог автозапчастей</h3>
          
          <div className="mb-8">
            <Input 
              placeholder="Поиск запчастей..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md mx-auto"
            />
          </div>

          <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setSelectedBrand(value)}>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              {categories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
                  <Icon name={cat.icon as any} className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className="hover:shadow-xl transition-shadow animate-fade-in group" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discount && (
                      <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        -{product.discount}%
                      </Badge>
                    )}
                    {!product.stock && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                        Нет в наличии
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">{product.brand}</Badge>
                  <CardTitle className="font-heading text-lg mb-2">{product.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {(product.discount ? product.price * (1 - product.discount / 100) : product.price).toLocaleString()} ₽
                    </span>
                    {product.discount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.price.toLocaleString()} ₽
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full" 
                    onClick={() => addToCart(product)}
                    disabled={!product.stock}
                  >
                    <Icon name="ShoppingCart" className="mr-2 w-4 h-4" />
                    {product.stock ? 'В корзину' : 'Нет в наличии'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <Icon name="Truck" className="w-12 h-12 mx-auto mb-4" />
              <h4 className="font-heading text-xl font-bold mb-2">Быстрая доставка</h4>
              <p className="text-primary-foreground/80">Доставка по России от 1 дня</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Icon name="Shield" className="w-12 h-12 mx-auto mb-4" />
              <h4 className="font-heading text-xl font-bold mb-2">Гарантия качества</h4>
              <p className="text-primary-foreground/80">Все товары сертифицированы</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Icon name="Headphones" className="w-12 h-12 mx-auto mb-4" />
              <h4 className="font-heading text-xl font-bold mb-2">Поддержка 24/7</h4>
              <p className="text-primary-foreground/80">Всегда готовы помочь</p>
            </div>
          </div>
        </div>
      </section>

      <section id="delivery" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-heading font-bold text-center mb-12 text-foreground">Доставка и оплата</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Icon name="Truck" className="w-5 h-5 text-primary" />
                  Способы доставки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Icon name="Check" className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Курьерская доставка</p>
                    <p className="text-sm text-muted-foreground">По Москве и МО - от 300₽</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Check" className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Транспортная компания</p>
                    <p className="text-sm text-muted-foreground">По всей России - расчет индивидуально</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Check" className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Самовывоз</p>
                    <p className="text-sm text-muted-foreground">Бесплатно из нашего склада</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Icon name="CreditCard" className="w-5 h-5 text-primary" />
                  Способы оплаты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Icon name="Check" className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Онлайн оплата</p>
                    <p className="text-sm text-muted-foreground">Банковские карты, электронные кошельки</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Check" className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Наличными курьеру</p>
                    <p className="text-sm text-muted-foreground">При получении заказа</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Check" className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Безналичный расчет</p>
                    <p className="text-sm text-muted-foreground">Для юридических лиц</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer id="contacts" className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Car" className="w-6 h-6 text-primary" />
                <h4 className="font-heading text-xl font-bold">AutoParts PRO</h4>
              </div>
              <p className="text-muted-foreground">Профессиональные автозапчасти для вашего автомобиля</p>
            </div>
            <div>
              <h4 className="font-heading text-lg font-bold mb-4">Контакты</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" className="w-4 h-4" />
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" className="w-4 h-4" />
                  <span>info@autoparts-pro.ru</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" className="w-4 h-4" />
                  <span>Москва, ул. Автозаводская, д. 1</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-heading text-lg font-bold mb-4">Режим работы</h4>
              <div className="space-y-1 text-muted-foreground">
                <p>Пн-Пт: 9:00 - 20:00</p>
                <p>Сб-Вс: 10:00 - 18:00</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 AutoParts PRO. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
