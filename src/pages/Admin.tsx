import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
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

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'brakes',
    price: 0,
    image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/0a7b622b-0ffc-4240-881b-95d78761629d.jpg',
    brand: '',
    stock: true,
    discount: 0
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }

    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const initialProducts: Product[] = [
        { id: 1, name: 'Тормозные колодки', category: 'brakes', price: 3500, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/3e49715f-e2c0-4381-b926-8f27dba2e7d3.jpg', brand: 'Brembo', stock: true, discount: 15 },
        { id: 2, name: 'Масляный фильтр', category: 'filters', price: 450, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/da726a92-fe29-4088-a9f0-19e7f87232c6.jpg', brand: 'Mann', stock: true },
        { id: 3, name: 'Комплект двигателя', category: 'engine', price: 25000, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/0a7b622b-0ffc-4240-881b-95d78761629d.jpg', brand: 'Bosch', stock: true, discount: 20 },
        { id: 4, name: 'Воздушный фильтр', category: 'filters', price: 550, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/da726a92-fe29-4088-a9f0-19e7f87232c6.jpg', brand: 'Mann', stock: true },
        { id: 5, name: 'Тормозные диски', category: 'brakes', price: 5200, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/3e49715f-e2c0-4381-b926-8f27dba2e7d3.jpg', brand: 'Brembo', stock: true },
        { id: 6, name: 'Свечи зажигания', category: 'engine', price: 800, image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/0a7b622b-0ffc-4240-881b-95d78761629d.jpg', brand: 'NGK', stock: false },
      ];
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, [user, isAdmin, navigate]);

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.brand || formData.price === 0) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: formData.name!,
      category: formData.category!,
      price: formData.price!,
      image: formData.image!,
      brand: formData.brand!,
      stock: formData.stock!,
      discount: formData.discount || 0
    };

    saveProducts([...products, newProduct]);
    toast({
      title: 'Товар добавлен',
      description: `${newProduct.name} добавлен в каталог`,
    });
    setIsDialogOpen(false);
    resetForm();
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !formData.name || !formData.brand || formData.price === 0) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const updatedProducts = products.map(p =>
      p.id === editingProduct.id ? { ...p, ...formData } as Product : p
    );

    saveProducts(updatedProducts);
    toast({
      title: 'Товар обновлен',
      description: `${formData.name} успешно обновлен`,
    });
    setIsDialogOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);
    toast({
      title: 'Товар удален',
      description: 'Товар удален из каталога',
    });
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'brakes',
      price: 0,
      image: 'https://cdn.poehali.dev/projects/c83f47bd-a908-4a14-9fde-752a62506983/files/0a7b622b-0ffc-4240-881b-95d78761629d.jpg',
      brand: '',
      stock: true,
      discount: 0
    });
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      brakes: 'Тормозная система',
      engine: 'Двигатель',
      filters: 'Фильтры'
    };
    return categories[category] || category;
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="ShieldCheck" className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-heading font-bold">Панель администратора</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/profile')}>
                <Icon name="User" className="mr-2 w-4 h-4" />
                Профиль
              </Button>
              <Button variant="ghost" onClick={() => navigate('/')}>
                <Icon name="Home" className="mr-2 w-4 h-4" />
                На главную
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Управление каталогом</h2>
              <p className="text-muted-foreground">Добавляйте, редактируйте и удаляйте товары</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingProduct(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Icon name="Plus" className="mr-2 w-4 h-4" />
                  Добавить товар
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-heading">
                    {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct ? 'Измените данные товара' : 'Заполните информацию о новом товаре'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Название товара *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Например: Тормозные колодки"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brand">Бренд *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Например: Brembo"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Цена (₽) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="discount">Скидка (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Категория</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brakes">Тормозная система</SelectItem>
                        <SelectItem value="engine">Двигатель</SelectItem>
                        <SelectItem value="filters">Фильтры</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">URL изображения</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stock"
                      checked={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="stock" className="cursor-pointer">В наличии</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>
                    {editingProduct ? 'Сохранить' : 'Добавить'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Каталог товаров</CardTitle>
              <CardDescription>Всего товаров: {products.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Фото</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Бренд</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Скидка</TableHead>
                    <TableHead>Наличие</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{getCategoryName(product.category)}</TableCell>
                      <TableCell>{product.price.toLocaleString()} ₽</TableCell>
                      <TableCell>
                        {product.discount ? (
                          <Badge variant="default">{product.discount}%</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.stock ? 'outline' : 'secondary'}>
                          {product.stock ? 'В наличии' : 'Нет'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(product)}>
                            <Icon name="Pencil" className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
                            <Icon name="Trash2" className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
