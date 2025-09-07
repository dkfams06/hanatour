'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import TourPreviewModal from '@/components/admin/TourPreviewModal';
import { Tour, TourStatus, Region, ApiResponse } from '@/lib/types';
import { regionInfo, tourStatusInfo } from '@/lib/mockData';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  Users,
  Star,
  MapPin,
  MoreVertical,
  Globe,
  EyeOff,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function AdminToursPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TourStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [previewTour, setPreviewTour] = useState<Tour | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // 검색어 실시간 처리를 위한 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchTours();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
    fetchTours();
  }, [selectedRegion, selectedStatus]);

  useEffect(() => {
    fetchTours();
  }, [currentPage]);

  // 메뉴 카테고리 로드
  const fetchMenuCategories = async () => {
    try {
      const response = await fetch('/api/admin/menu?includeStats=true');
      const data = await response.json();
      if (data.success) {
        setMenuCategories(data.data);
      }
    } catch (error) {
      console.error('메뉴 카테고리 로드 실패:', error);
    }
  };

  // 카테고리 모달 열 때 카테고리 로드
  useEffect(() => {
    if (showCategoryModal) {
      fetchMenuCategories();
    }
  }, [showCategoryModal]);

  const fetchTours = async () => {
    try {
      setIsLoadingTours(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50', // 10개에서 50개로 변경
        ...(searchQuery && { search: searchQuery }),
        ...(selectedRegion !== 'all' && { region: selectedRegion }),
        ...(selectedStatus !== 'all' && { status: selectedStatus }),
        // 관리자는 모든 상태의 투어를 볼 수 있음
        status: selectedStatus !== 'all' ? selectedStatus : ''
      });

      const response = await fetch(`/api/admin/tours?${params}`);
      const data: { success: boolean; tours?: Tour[]; totalCount?: number; error?: string } = await response.json();

      if (data.success && data.tours) {
        setTours(data.tours);
        setTotalCount(data.totalCount || data.tours.length);
        // 페이지네이션 계산 개선
        const calculatedTotalPages = Math.ceil((data.totalCount || data.tours.length) / 50); // 50으로 변경
        setTotalPages(Math.max(1, calculatedTotalPages));
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setIsLoadingTours(false);
    }
  };



  const handleDeleteTour = async (tourId: string) => {
    if (!confirm('정말로 이 여행상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('여행상품이 삭제되었습니다.');
        fetchTours();
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handlePreviewTour = async (tourId: string) => {
    try {
      const response = await fetch(`/api/admin/tours/${tourId}`);
      const data = await response.json();
      
      if (data.success && data.tour) {
        setPreviewTour(data.tour);
        setShowPreviewModal(true);
      } else {
        alert('상품 정보를 불러올 수 없습니다.');
      }
    } catch (error) {
      alert('상품 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleStatusChange = async (tourId: string, newStatus: TourStatus) => {
    try {
      const tour = tours.find(t => t.id === tourId);
      if (!tour) return;

      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tour,
          status: newStatus,
          included: tour.included || [],
          excluded: tour.excluded || [],
        }),
      });

      if (response.ok) {
        alert('상태가 변경되었습니다.');
        fetchTours();
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleSelectTour = (tourId: string, checked: boolean) => {
    if (checked) {
      setSelectedTours(prev => [...prev, tourId]);
    } else {
      setSelectedTours(prev => prev.filter(id => id !== tourId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTours(tours.map(tour => tour.id));
    } else {
      setSelectedTours([]);
    }
  };

  const handleBulkStatusChange = async (newStatus: TourStatus) => {
    if (selectedTours.length === 0) return;

    if (!confirm(`선택된 ${selectedTours.length}개 상품의 상태를 "${tourStatusInfo[newStatus].name}"으로 변경하시겠습니까?`)) {
      return;
    }

    try {
      const promises = selectedTours.map(tourId => {
        const tour = tours.find(t => t.id === tourId);
        if (!tour) return Promise.resolve();

        return fetch(`/api/admin/tours/${tourId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...tour,
            status: newStatus,
            included: tour.included || [],
            excluded: tour.excluded || [],
          }),
        });
      });

      await Promise.all(promises);
      alert('일괄 상태 변경이 완료되었습니다.');
      setSelectedTours([]);
      fetchTours();
    } catch (error) {
      alert('일괄 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTours.length === 0) return;

    if (!confirm(`선택된 ${selectedTours.length}개 상품을 정말로 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const promises = selectedTours.map(tourId =>
        fetch(`/api/admin/tours/${tourId}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(promises);
      alert('선택된 상품들이 삭제되었습니다.');
      setSelectedTours([]);
      fetchTours();
    } catch (error) {
      alert('일괄 삭제 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 연결 처리
  const handleCategoryConnect = async () => {
    if (selectedCategories.length === 0) {
      alert('연결할 카테고리를 선택해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/admin/tours/connect-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourIds: selectedTours,
          categoryIds: selectedCategories
        })
      });

      const result = await response.json();
      if (result.success) {
        alert(`${selectedTours.length}개 상품이 ${selectedCategories.length}개 카테고리에 연결되었습니다.`);
        setShowCategoryModal(false);
        setSelectedCategories([]);
        setSelectedTours([]);
        fetchTours();
      } else {
        alert('카테고리 연결에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('카테고리 연결 에러:', error);
      alert('카테고리 연결 중 오류가 발생했습니다.');
    }
  };

  // 카테고리 선택 토글
  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusBadge = (status: TourStatus) => {
    const statusConfig = tourStatusInfo[status];
    return (
      <Badge 
        style={{ backgroundColor: statusConfig.color, color: 'white' }}
      >
        {statusConfig.name}
      </Badge>
    );
  };

  const getRegionBadge = (region: Region) => {
    const regionConfig = regionInfo[region];
    if (!regionConfig) {
      // 정의되지 않은 지역의 경우 기본값 반환
      return (
        <Badge 
          variant="outline"
          style={{ borderColor: '#6B7280', color: '#6B7280' }}
        >
          {region}
        </Badge>
      );
    }
    return (
      <Badge 
        variant="outline"
        style={{ borderColor: regionConfig.color, color: regionConfig.color }}
      >
        {regionConfig.name}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">여행상품 관리</h1>
            <p className="text-gray-600">여행상품을 등록하고 관리할 수 있습니다.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push('/admin/tours/bulk-upload')}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              엑셀 업로드
            </Button>
            <Button 
              onClick={() => router.push('/admin/tours/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 상품 등록
            </Button>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="상품명으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select 
                  value={selectedRegion} 
                  onValueChange={(value) => setSelectedRegion(value as Region | 'all')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    {Object.entries(regionInfo).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={selectedStatus} 
                  onValueChange={(value) => setSelectedStatus(value as TourStatus | 'all')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    {Object.entries(tourStatusInfo).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 투어 목록 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>여행상품 목록</CardTitle>
              <div className="text-sm text-gray-600">
                총 {totalCount}개 상품
                {totalCount > 0 && (
                  <span className="ml-2">
                    ({(currentPage - 1) * 50 + 1}-{Math.min(currentPage * 50, totalCount)})
                  </span>
                )}
              </div>
            </div>
            
            {/* 일괄 작업 툴바 */}
            {selectedTours.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedTours.length}개 상품 선택됨
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTours([])}
                    >
                      선택 해제
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCategoryModal(true)}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      카테고리 연결
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          일괄 상태 변경
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {Object.entries(tourStatusInfo).map(([key, value]) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => handleBulkStatusChange(key as TourStatus)}
                          >
                            {key === 'published' && <Globe className="w-3 h-3 mr-2" />}
                            {key === 'unpublished' && <EyeOff className="w-3 h-3 mr-2" />}
                            {value.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDelete}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      일괄 삭제
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoadingTours ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">등록된 여행상품이 없습니다.</p>
                <Button 
                  onClick={() => router.push('/admin/tours/new')}
                  className="mt-4"
                >
                  첫 상품 등록하기
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 전체 선택 체크박스 */}
                <div className="flex items-center space-x-3 p-2 border-b">
                  <Checkbox
                    checked={tours.length > 0 && selectedTours.length === tours.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    전체 선택 ({tours.length}개)
                  </span>
                </div>

                {tours.map((tour) => (
                  <div 
                    key={tour.id} 
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      selectedTours.includes(tour.id) ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* 체크박스 */}
                      <Checkbox
                        checked={selectedTours.includes(tour.id)}
                        onCheckedChange={(checked) => handleSelectTour(tour.id, checked as boolean)}
                      />
                      
                      {/* 상품 이미지 */}
                      <img
                        src={tour.mainImage}
                        alt={tour.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      {/* 상품 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {tour.title}
                          </h3>
                          {getStatusBadge(tour.status)}
                          {getRegionBadge(tour.region)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(tour.departureDate)}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {tour.currentParticipants}/{tour.maxParticipants}명
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {tour.rating ? tour.rating.toFixed(1) : '0.0'} ({tour.reviewCount || 0}개)
                          </div>
                          <div className="font-semibold text-blue-600">
                            {formatPrice(tour.price)}
                          </div>
                        </div>
                      </div>
                      
                      {/* 액션 버튼 */}
                      <div className="flex items-center space-x-2">
                        {/* 빠른 상태 변경 */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`min-w-[80px] ${
                                tour.status === 'published' ? 'bg-green-50 text-green-700' : 
                                tour.status === 'unpublished' ? 'bg-gray-50 text-gray-700' :
                                'bg-yellow-50 text-yellow-700'
                              }`}
                            >
                              {tour.status === 'published' && <Globe className="w-3 h-3 mr-1" />}
                              {tour.status === 'unpublished' && <EyeOff className="w-3 h-3 mr-1" />}
                              {tourStatusInfo[tour.status]?.name || tour.status}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {Object.entries(tourStatusInfo).map(([key, value]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() => handleStatusChange(tour.id, key as TourStatus)}
                                className={tour.status === key ? 'bg-gray-100' : ''}
                              >
                                <div className="flex items-center">
                                  {key === 'published' && <Globe className="w-3 h-3 mr-2" />}
                                  {key === 'unpublished' && <EyeOff className="w-3 h-3 mr-2" />}
                                  {value.name}
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* 기본 액션 버튼들 */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewTour(tour.id)}
                          title="미리보기"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/tours/${tour.id}/edit`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/tours/${tour.id}`)}>
                              <Globe className="w-4 h-4 mr-2" />
                              실제 페이지 보기
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTour(tour.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  처음
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                
                <div className="flex items-center space-x-2">
                  {/* 페이지 번호 표시 */}
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="min-w-[32px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  마지막
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 미리보기 모달 */}
        <TourPreviewModal
          tour={previewTour}
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewTour(null);
          }}
        />

        {/* 카테고리 연결 모달 */}
        <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>카테고리 연결</DialogTitle>
              <p className="text-sm text-gray-600">
                선택된 {selectedTours.length}개 상품에 연결할 카테고리를 선택하세요.
              </p>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-sm font-medium">메인 메뉴</div>
              {menuCategories
                .filter(category => category.menu_level === 'main')
                .map(category => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategorySelection(category.id)}
                      />
                      <label htmlFor={category.id} className="font-medium">
                        {category.name}
                      </label>
                      <Badge variant="outline">{category.menu_type}</Badge>
                    </div>
                    
                    {/* 서브 메뉴 */}
                    {category.children && category.children.length > 0 && (
                      <div className="ml-6 space-y-1">
                        {category.children.map((child: any) => (
                          <div key={child.id} className="flex items-center space-x-2 p-1">
                            <Checkbox
                              id={child.id}
                              checked={selectedCategories.includes(child.id)}
                              onCheckedChange={() => toggleCategorySelection(child.id)}
                            />
                            <label htmlFor={child.id} className="text-sm">
                              {child.name}
                            </label>
                            <Badge variant="outline" className="text-xs">{child.menu_type}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              
              <div className="text-sm font-medium mt-6">독립 서브 메뉴</div>
              {menuCategories
                .filter(category => category.menu_level === 'sub' && !category.parent_id)
                .map(category => (
                  <div key={category.id} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategorySelection(category.id)}
                    />
                    <label htmlFor={category.id}>
                      {category.name}
                    </label>
                    <Badge variant="outline">{category.menu_type}</Badge>
                  </div>
                ))}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCategoryModal(false)}>
                취소
              </Button>
              <Button onClick={handleCategoryConnect}>
                연결하기 ({selectedCategories.length}개 선택됨)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
} 