import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: number;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  items: { name: string; quantity: number; price: number }[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [orders] = useState<Order[]>([
    {
      id: 1001,
      date: '2024-11-10',
      total: 5950,
      status: 'delivered',
      items: [
        { name: 'Тормозные колодки', quantity: 1, price: 2975 },
        { name: 'Масляный фильтр', quantity: 1, price: 450 },
        { name: 'Воздушный фильтр', quantity: 1, price: 550 },
      ]
    },
    {
      id: 1002,
      date: '2024-11-13',
      total: 20000,
      status: 'processing',
      items: [
        { name: 'Комплект двигателя', quantity: 1, price: 20000 },
      ]
    }
  ]);

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: { text: 'Ожидает', variant: 'secondary' as const },
      processing: { text: 'В обработке', variant: 'default' as const },
      delivered: { text: 'Доставлен', variant: 'outline' as const }
    };
    return labels[status];
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Car" className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-heading font-bold">AutoParts PRO</h1>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="Home" className="mr-2 w-4 h-4" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Личный кабинет</h2>
              <p className="text-muted-foreground">Добро пожаловать, {user.name}!</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" className="mr-2 w-4 h-4" />
              Выйти
            </Button>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders">
                <Icon name="Package" className="mr-2 w-4 h-4" />
                Заказы
              </TabsTrigger>
              <TabsTrigger value="profile">
                <Icon name="User" className="mr-2 w-4 h-4" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Icon name="Settings" className="mr-2 w-4 h-4" />
                Настройки
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">История заказов</CardTitle>
                  <CardDescription>Все ваши заказы за последние 30 дней</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="font-heading text-lg">Заказ #{order.id}</CardTitle>
                            <CardDescription>{new Date(order.date).toLocaleDateString('ru-RU')}</CardDescription>
                          </div>
                          <Badge variant={getStatusLabel(order.status).variant}>
                            {getStatusLabel(order.status).text}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span className="font-medium">{item.price.toLocaleString()} ₽</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t flex justify-between font-bold">
                            <span>Итого:</span>
                            <span className="text-primary">{order.total.toLocaleString()} ₽</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Информация о профиле</CardTitle>
                  <CardDescription>Ваши личные данные</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Имя</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Роль</p>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID</p>
                      <p className="font-medium">#{user.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {user.role === 'admin' && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Icon name="ShieldCheck" className="w-5 h-5 text-primary" />
                      Доступ администратора
                    </CardTitle>
                    <CardDescription>У вас есть права администратора</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => navigate('/admin')} className="w-full">
                      <Icon name="Settings" className="mr-2 w-4 h-4" />
                      Перейти в панель администратора
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Настройки аккаунта</CardTitle>
                  <CardDescription>Управление вашим аккаунтом</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Уведомления</h4>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Email уведомления</p>
                        <p className="text-sm text-muted-foreground">Получать уведомления о заказах</p>
                      </div>
                      <Button variant="outline" size="sm">Включено</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Безопасность</h4>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Key" className="mr-2 w-4 h-4" />
                      Изменить пароль
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
