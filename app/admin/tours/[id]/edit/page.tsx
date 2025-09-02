'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Region, TourStatus, Tour } from '@/lib/types';
import { regionInfo, tourStatusInfo } from '@/lib/mockData';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/admin/ImageUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

interface TourFormData {
  title: string;
  description: string;
  images: string[];
  mainImage: string;
  departureDate: string;
  maxParticipants: number;
  price: number;
  included: string[];
  excluded: string[];
  region: Region | '';
  status: TourStatus;
  continent: string;
  country: string;
}

export default function EditTourPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const tourId = params.id as string;
  
  const [formData, setFormData] = useState<TourFormData>({
    title: '',
    description: '',
    images: [],
    mainImage: '',
    departureDate: '',
    maxParticipants: 1,
    price: 0,
    included: [''],
    excluded: [''],
    region: '',
    status: 'unpublished',
    continent: '',
    country: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTour, setIsLoadingTour] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (tourId) {
      fetchTourData();
    }
  }, [tourId]);

  const fetchTourData = async () => {
    try {
      setIsLoadingTour(true);
      const response = await fetch(`/api/admin/tours/${tourId}`);
      const data = await response.json();

      if (data.success && data.tour) {
        const tour: Tour = data.tour;
        setFormData({
          title: tour.title,
          description: tour.description,
          images: tour.images,
          mainImage: tour.mainImage,
          departureDate: tour.departureDate.split('T')[0], // 날짜 포맷 조정
          maxParticipants: tour.maxParticipants,
          price: tour.price,
          included: tour.included.length > 0 ? tour.included : [''],
          excluded: tour.excluded.length > 0 ? tour.excluded : [''],
          region: tour.region,
          status: tour.status,
          continent: tour.continent || '',
          country: tour.country || ''
        });
      } else {
        alert('상품 정보를 불러올 수 없습니다.');
        router.push('/admin/tours');
      }
    } catch (error) {
      alert('상품 정보를 불러오는 중 오류가 발생했습니다.');
      router.push('/admin/tours');
    } finally {
      setIsLoadingTour(false);
    }
  };

  const handleInputChange = (field: keyof TourFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: 'included' | 'excluded', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'included' | 'excluded') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'included' | 'excluded', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleMainImageChange = (url: string) => {
    handleInputChange('mainImage', url);
  };

  const handleImagesChange = (urls: string[]) => {
    handleInputChange('images', urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.title || !formData.description || !formData.region || 
        !formData.departureDate || !formData.mainImage ||
        !formData.continent || !formData.country) {
      alert('필수 입력값을 모두 채워주세요. (대륙, 국가 포함)');
      return;
    }

    // 수정 페이지에서는 대표 이미지만 필수, 추가 이미지는 선택사항
    // (기존에 이미지가 있을 수 있으므로 강제하지 않음)

    setIsSubmitting(true);

    const submitData = {
      ...formData,
      included: formData.included.filter(item => item.trim() !== ''),
      excluded: formData.excluded.filter(item => item.trim() !== ''),
    };

    console.log('수정할 데이터:', submitData); // 디버깅용

    try {
      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      console.log('서버 응답:', data); // 디버깅용

      if (data.success) {
        alert('여행상품이 성공적으로 수정되었습니다.');
        router.push('/admin/tours');
      } else {
        console.error('수정 실패:', data.error);
        alert(data.error || '상품 수정에 실패했습니다.');
      }
    } catch (error) {
      alert('상품 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isLoadingTour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  // 1. 대륙, 국가 옵션 상수 추가 (컴포넌트 상단)
  const CONTINENT_OPTIONS = [
    'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Antarctica'
  ];
  const COUNTRY_OPTIONS = [
    'Korea', 'Japan', 'China', 'France', 'USA', 'Canada', 'Australia', 'Germany', 'UK', 'Italy', 'Spain', 'Vietnam', 'Thailand', 'Singapore', 'Switzerland', 'Turkey', 'Brazil', 'South Africa', 'Egypt', 'New Zealand'
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">여행상품 수정</h1>
            <p className="text-gray-600">여행상품 정보를 수정해주세요.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">상품명 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="여행상품명을 입력하세요"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">상세 설명 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="여행상품에 대한 상세 설명을 입력하세요"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="continent">대륙 *</Label>
                  <Select
                    value={formData.continent}
                    onValueChange={value => handleInputChange('continent', value)}
                    required
                  >
                    <SelectTrigger id="continent">
                      <SelectValue placeholder="대륙을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTINENT_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="country">국가 *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={value => handleInputChange('country', value)}
                    required
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="국가를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">지역 *</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(value) => handleInputChange('region', value as Region)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="지역을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(regionInfo).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">게시 상태</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value as TourStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tourStatusInfo).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="departureDate">출발일 *</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => handleInputChange('departureDate', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxParticipants">최대 인원 *</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">가격(원) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 이미지 관리 */}
          <Card>
            <CardHeader>
              <CardTitle>이미지 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                value={formData.mainImage}
                onChange={handleMainImageChange}
                label="대표 이미지"
                required
                placeholder="대표 이미지를 업로드하거나 URL을 입력하세요"
              />

              <MultiImageUpload
                value={formData.images}
                onChange={handleImagesChange}
                label="추가 이미지"
                maxImages={5}
              />
            </CardContent>
          </Card>

          {/* 포함/불포함 사항 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>포함사항</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {formData.included.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayFieldChange('included', index, e.target.value)}
                      placeholder={`포함사항 ${index + 1}`}
                    />
                    {formData.included.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('included', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('included')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  포함사항 추가
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>불포함사항</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {formData.excluded.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayFieldChange('excluded', index, e.target.value)}
                      placeholder={`불포함사항 ${index + 1}`}
                    />
                    {formData.excluded.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayField('excluded', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('excluded')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  불포함사항 추가
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? '수정 중...' : '상품 수정'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
} 