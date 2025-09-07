'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TermsAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  isLoading?: boolean;
}

export default function TermsAgreementModal({ isOpen, onClose, onAgree, isLoading = false }: TermsAgreementModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    terms: boolean;
    privacy: boolean;
  }>({
    terms: false,
    privacy: false
  });

  const handleAgree = () => {
    if (isAgreed) {
      onAgree();
      onClose();
    }
  };

  const handleClose = () => {
    setIsAgreed(false);
    setExpandedSections({ terms: false, privacy: false });
    onClose();
  };

  const toggleSection = (section: 'terms' | 'privacy') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl md:text-2xl font-bold text-center">
            회원가입약관
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm md:text-base">
            회원가입약관의 내용에 동의하셔야 회원가입 하실 수 있습니다.
          </p>
        </DialogHeader>
        
        {/* 약관 내용 영역 */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-[20vh] pr-4">
            <div className="space-y-4">
              {/* 회원가입약관 */}
              <section className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('terms')}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
                >
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">
                    회원가입약관
                  </h3>
                  {expandedSections.terms ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                {expandedSections.terms && (
                  <div className="p-4 space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed">
                    <div>
                      <h4 className="font-semibold mb-2">제1조(목적)</h4>
                      <p>
                        이 약관은 "투어"가 제공하는 인터넷 관련 서비스(이하 "서비스"라 한다)의 이용과 관련하여 
                        "투어"와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다. 
                        이 약관은 PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 
                        준용됩니다.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">제2조(정의)</h4>
                      <div className="space-y-2">
                        <p><strong>① "투어"</strong>란 엔젤투어(주)가 재화 또는 용역(이하 "재화 등"이라 함)을 이용자에게 제공하기 위하여 
                        컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 
                        아울러 사이버 몰을 운영하는 사업자의 의미로도 사용합니다.</p>
                        <p><strong>② "이용자"</strong>란 "투어"에 접속하여 이 약관에 따라 "투어"가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
                        <p><strong>③ "회원"</strong>이라 함은 "투어"에 회원등록을 한 자로서, 계속적으로 "투어"가 제공하는 서비스를 이용할 수 있는 자를 말합니다.</p>
                        <p><strong>④ "비회원"</strong>이라 함은 회원에 가입하지 않고 "투어"가 제공하는 서비스를 이용하는 자를 말합니다.</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">제3조(약관 등의 명시와 설명 및 개정)</h4>
                      <div className="space-y-2">
                        <p>① "투어"는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 
                        전화번호·모사전송번호·전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보보호책임자등(개인정보보호책임자등)을 
                        이용자가 쉽게 알 수 있도록 00 사이버몰의 초기 서비스화면(전면)에 게시합니다.</p>
                        <p>② "투어"는 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회·배송책임·환불조건 등과 같은 
                        중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.</p>
                        <p>③ "투어"는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 
                        「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 
                        「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">제4조(서비스의 제공 및 변경)</h4>
                      <div className="space-y-2">
                        <p>① "투어"는 다음과 같은 업무를 수행합니다.</p>
                        <div className="ml-4 space-y-1">
                          <p>1. 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</p>
                          <p>2. 구매계약이 체결된 재화 또는 용역의 배송</p>
                          <p>3. 기타 "투어"가 정하는 업무</p>
                        </div>
                        <p>② "투어"는 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 
                        용역의 내용을 변경할 수 있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공일자를 명시하여 현재의 재화 또는 
                        용역의 내용을 게시한 곳에 즉시 공지합니다.</p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* 개인정보처리방침 */}
              <section className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('privacy')}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
                >
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">
                    개인정보처리방침안내
                  </h3>
                  {expandedSections.privacy ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                {expandedSections.privacy && (
                  <div className="p-4 space-y-4 text-xs md:text-sm text-gray-700 leading-relaxed">
                    <p>
                      엔젤투어(주)(이하 '회사')는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수하고 있습니다. 
                      회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 
                      개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다. 회사는 개인정보처리방침을 개정하는 경우 
                      웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.
                    </p>

                    <div>
                      <h4 className="font-semibold mb-2">1. 수집하는 개인정보 항목</h4>
                      <div className="space-y-2">
                        <p><strong>필수적으로 수집하는 정보</strong></p>
                        <div className="ml-4 space-y-1">
                          <p><strong>① 개인정보 수집 항목:</strong> 이름, 아이디, 비밀번호, 이메일</p>
                          <p><strong>② 서비스 이용 항목:</strong> 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보, 결제기록, 회원 행동기록</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">2. 개인정보의 수집 및 이용목적</h4>
                      <div className="space-y-1">
                        <p>① 회원가입 및 관리</p>
                        <p>② 서비스 제공 및 운영</p>
                        <p>③ 고객상담 및 문의응대</p>
                        <p>④ 마케팅 및 광고에의 활용</p>
                        <p>⑤ 신규 서비스 개발 및 맞춤 서비스 제공</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">3. 개인정보의 보유 및 이용기간</h4>
                      <p>
                        회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 
                        단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 
                        회원정보를 보관합니다.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">4. 개인정보의 파기절차 및 방법</h4>
                      <p>
                        회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 
                        해당 개인정보를 파기합니다. 파기절차 및 방법은 다음과 같습니다.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </ScrollArea>
        </div>

        {/* 하단 고정 영역 */}
        <div className="flex-shrink-0 space-y-4 pt-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms-agreement"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
            />
            <Label htmlFor="terms-agreement" className="text-sm">
              회원가입 약관에 동의합니다.
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              취소
            </Button>
            <Button 
              onClick={handleAgree}
              disabled={!isAgreed || isLoading}
              className="bg-gray-800 text-white hover:bg-gray-700 w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? <div className="loading-spinner" /> : "회원가입"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
