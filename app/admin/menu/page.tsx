'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Menu, 
  Edit, 
  Save, 
  ChevronRight, 
  ChevronDown, 
  Map, 
  MapPin, 
  Building,
  Globe,
  BarChart3,
  Eye,
  EyeOff,
  Palette,
  GripVertical,
  Plus,
  Trash2,
  Package,
  Star
} from 'lucide-react';

interface MenuCategory {
  id: string;
  name: string;
  parent_id: string | null;
  menu_order: number;
  menu_level: 'main' | 'sub';
  menu_color: string | null;
  menu_icon: string | null;
  menu_type: 'destination' | 'product' | 'theme';
  href_path: string | null;
  description: string | null;
  is_active: boolean;
  show_in_menu: boolean;
  tour_count: number;
  children_count: number;
  children?: MenuCategory[];
  parent_name?: string;
}

export default function MenuManagementPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<MenuCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    parent_id: 'none',
    menu_order: 0,
    menu_level: 'main' as 'main' | 'sub',
    menu_color: '',
    menu_icon: '',
    menu_type: 'destination' as 'destination' | 'product' | 'theme',
    href_path: '',
    description: '',
    is_active: true,
    show_in_menu: true
  });

  // 관리자 권한 확인
  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchMenuCategories();
  }, [user, router]);

  // 메뉴 카테고리 목록 조회
  const fetchMenuCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        includeStats: 'true'
      });

      if (selectedTab !== 'all') {
        if (['main', 'sub'].includes(selectedTab)) {
          params.set('level', selectedTab);
        } else {
          params.set('type', selectedTab);
        }
      }

      console.log('메뉴 API 호출 URL:', `/api/admin/menu?${params}`);
      const response = await fetch(`/api/admin/menu?${params}`);
      console.log('API 응답 상태:', response.status);
      const data = await response.json();
      console.log('API 응답 데이터:', data);

      if (data.success) {
        console.log('메뉴 데이터 개수:', data.data.length);
        setMenuCategories(data.data);
      } else {
        console.error('메뉴 조회 실패:', data.error);
      }
    } catch (error) {
      console.error('메뉴 조회 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 데이터 다시 로드
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMenuCategories();
    }
  }, [selectedTab]);

  // 메뉴 아이템 토글
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // 편집 다이얼로그 열기
  const openEditDialog = (item?: MenuCategory) => {
    if (item) {
      setFormData({
        id: item.id,
        name: item.name,
        parent_id: item.parent_id || 'none',
        menu_order: item.menu_order,
        menu_level: item.menu_level,
        menu_color: item.menu_color || '',
        menu_icon: item.menu_icon || '',
        menu_type: item.menu_type,
        href_path: item.href_path || '',
        description: item.description || '',
        is_active: item.is_active,
        show_in_menu: item.show_in_menu
      });
      setEditingItem(item);
      setIsCreating(false);
    } else {
      setFormData({
        id: '',
        name: '',
        parent_id: 'none',
        menu_order: 0,
        menu_level: 'main',
        menu_color: '',
        menu_icon: '',
        menu_type: 'destination',
        href_path: '',
        description: '',
        is_active: true,
        show_in_menu: true
      });
      setEditingItem(null);
      setIsCreating(true);
    }
    setIsDialogOpen(true);
  };

  // 메뉴 저장
  const saveMenu = async () => {
    try {
      const url = isCreating ? '/api/admin/menu' : '/api/admin/menu';
      const method = isCreating ? 'POST' : 'PUT';

      const submitData = {
        ...formData,
        parent_id: formData.parent_id === 'none' ? null : formData.parent_id
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        await fetchMenuCategories();
        setIsDialogOpen(false);
      } else {
        alert(`저장 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('메뉴 저장 에러:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 메뉴 삭제
  const deleteMenu = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/menu?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await fetchMenuCategories();
      } else {
        alert(`삭제 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('메뉴 삭제 에러:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 메뉴 레벨 아이콘
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'main': return <Globe className="w-4 h-4" />;
      case 'sub': return <Map className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  // 메뉴 타입 아이콘
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'destination': return <MapPin className="w-4 h-4" />;
      case 'product': return <Package className="w-4 h-4" />;
      case 'theme': return <Star className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  // 메뉴 타입 색상
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'destination': return 'blue';
      case 'product': return 'purple';
      case 'theme': return 'green';
      default: return 'gray';
    }
  };

  // 가능한 상위 메뉴 목록 (재귀적으로 자식 제외)
  const getAvailableParents = (): MenuCategory[] => {
    const flattenMenus = (menus: MenuCategory[]): MenuCategory[] => {
      const result: MenuCategory[] = [];
      menus.forEach(menu => {
        result.push(menu);
        if (menu.children) {
          result.push(...flattenMenus(menu.children));
        }
      });
      return result;
    };

    const allMenus = flattenMenus(menuCategories);
    return allMenus.filter(menu => 
      menu.menu_level === 'main' && 
      menu.id !== formData.id // 자기 자신 제외
    );
  };

  // 메뉴 아이템 렌더링
  const renderMenuItem = (item: MenuCategory, depth = 0) => (
    <div key={item.id} className="border border-gray-200 rounded-lg mb-2">
      <div className="p-4 flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-3" style={{ marginLeft: depth * 20 }}>
          {item.children && item.children.length > 0 && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {expandedItems.has(item.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          
          <div className="flex items-center space-x-2">
            {getLevelIcon(item.menu_level)}
            <span className="font-medium">{item.name}</span>
            <Badge variant="outline" className={`text-${getTypeColor(item.menu_type)}-600`}>
              {getTypeIcon(item.menu_type)}
              <span className="ml-1">{item.menu_type}</span>
            </Badge>
            <Badge variant="secondary">
              {item.menu_level}
            </Badge>
          </div>

          {item.menu_color && (
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: item.menu_color }}
            />
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            <BarChart3 className="w-3 h-3 mr-1" />
            {item.tour_count}개 투어
          </Badge>

          <div className="flex items-center space-x-1">
            {item.show_in_menu ? (
              <Eye
                className="w-4 h-4 text-green-600 cursor-pointer"
                onClick={() => toggleShowInMenu(item)}
                aria-label="숨기기"
              />
            ) : (
              <EyeOff
                className="w-4 h-4 text-gray-400 cursor-pointer"
                onClick={() => toggleShowInMenu(item)}
                aria-label="표시하기"
              />
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteMenu(item.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {expandedItems.has(item.id) && item.children && item.children.length > 0 && (
        <div className="border-t bg-white p-2">
          {item.children.map(child => renderMenuItem(child, depth + 1))}
        </div>
      )}
    </div>
  );

  // 1. toggleShowInMenu 함수 추가 (컴포넌트 내부)
  const toggleShowInMenu = async (item: MenuCategory) => {
    try {
      await fetch('/api/admin/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          show_in_menu: !item.show_in_menu,
        }),
      });
      await fetchMenuCategories();
    } catch (e) {
      alert('숨김/표시 변경 실패');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">로딩 중...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">메뉴 관리</h1>
            <p className="text-gray-600 mt-1">사이트 네비게이션 메뉴를 관리합니다</p>
          </div>
          <Button onClick={() => openEditDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            새 메뉴 추가
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="main">메인 메뉴</TabsTrigger>
            <TabsTrigger value="sub">서브 메뉴</TabsTrigger>
            <TabsTrigger value="destination">지역</TabsTrigger>
            <TabsTrigger value="product">상품</TabsTrigger>
            <TabsTrigger value="theme">테마</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {menuCategories.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-gray-500">메뉴가 없습니다.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {menuCategories.map(item => renderMenuItem(item))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* 편집/생성 다이얼로그 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreating ? '새 메뉴 추가' : '메뉴 편집'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="id">메뉴 ID</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    disabled={!isCreating}
                    placeholder="예: japan, staycation-hotels"
                  />
                </div>
                <div>
                  <Label htmlFor="name">메뉴명</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="예: 일본, 호텔"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="menu_level">메뉴 레벨</Label>
                  <Select
                    value={formData.menu_level}
                    onValueChange={(value: 'main' | 'sub') => 
                      setFormData({...formData, menu_level: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">메인 메뉴</SelectItem>
                      <SelectItem value="sub">서브 메뉴</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="menu_type">메뉴 타입</Label>
                  <Select
                    value={formData.menu_type}
                    onValueChange={(value: 'destination' | 'product' | 'theme') => 
                      setFormData({...formData, menu_type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="destination">지역</SelectItem>
                      <SelectItem value="product">상품</SelectItem>
                      <SelectItem value="theme">테마</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="menu_order">순서</Label>
                  <Input
                    id="menu_order"
                    type="number"
                    value={formData.menu_order}
                    onChange={(e) => setFormData({...formData, menu_order: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              {formData.menu_level === 'sub' && (
                <div>
                  <Label htmlFor="parent_id">상위 메뉴</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) => setFormData({...formData, parent_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상위 메뉴 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">없음</SelectItem>
                      {getAvailableParents().map(parent => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="href_path">링크 경로</Label>
                  <Input
                    id="href_path"
                    value={formData.href_path}
                    onChange={(e) => setFormData({...formData, href_path: e.target.value})}
                    placeholder="예: /tours/destination/japan"
                  />
                </div>
                <div>
                  <Label htmlFor="menu_color">메뉴 색상</Label>
                  <Input
                    id="menu_color"
                    value={formData.menu_color}
                    onChange={(e) => setFormData({...formData, menu_color: e.target.value})}
                    placeholder="예: #3B82F6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="메뉴에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active">활성화</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_in_menu"
                    checked={formData.show_in_menu}
                    onCheckedChange={(checked) => setFormData({...formData, show_in_menu: checked})}
                  />
                  <Label htmlFor="show_in_menu">메뉴 표시</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={saveMenu}>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
} 