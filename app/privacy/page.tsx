import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  Lock, 
  Trash2, 
  UserCheck,
  AlertTriangle,
  Phone,
  Mail
} from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">개인정보처리방침</h1>
          <p className="text-lg text-gray-600">
            최종 수정일: 2024년 1월 1일
          </p>
        </div>

        {/* 개인정보 처리방침 개요 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="text-sm text-gray-700 leading-relaxed">
                당사는 고객님의 개인정보처리방침을 매우 중요시하며, 『정보통신망 이용촉진 및 정보보호에 관한 법률』상의 개인정보보호 규정 및 행정안전부가 제정한 『개인정보보호법』을 준수하고 있습니다. 당사는 개인정보취급(처리)방침을 통하여 귀하께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다. *개인정보의 수집,제공 및 활용에 동의하지 않을 권리가 있으며, 미동의시 회원가입 및 여행서비스의 제공이 제한됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보의 수집방법 및 항목 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              1. 개인정보의 수집방법 및 항목
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-gray-700">
                당사는 여행 서비스 제공을 위해 필요한 최소한의 개인정보만을 수집합니다.
              </p>
              
              <div>
                <h3 className="font-semibold mb-3 text-lg">가. 필수항목</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">수집항목</th>
                        <th className="border border-gray-300 p-2 text-left">수집목적</th>
                        <th className="border border-gray-300 p-2 text-left">보유기간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">아이디, 비밀번호, 이름, 성별, 생년월일, 휴대폰 번호, 이메일 주소, 사업자등록번호</td>
                        <td className="border border-gray-300 p-2">회원제서비스 제공, 당사 약관변경 안내, 마케팅 정보제공 등의 회원관리<br/>여행자보험 가입<br/>항공권예약 및 발권, 호텔예약, 비자발급<br/>현금영수증 발급</td>
                        <td className="border border-gray-300 p-2">회원탈퇴 시까지</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">카드사명, 카드번호, 유효기간, 거래은행명, 계좌번호</td>
                        <td className="border border-gray-300 p-2">대금결제(카드결제 시)<br/>여행상품 상담 및 예약, 물품배송</td>
                        <td className="border border-gray-300 p-2">개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  단, 만14세 미만 아동의 경우 법정대리인의 동의를 얻은 경우에 수집 및 이용할 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-lg">나. 선택항목</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">수집항목</th>
                        <th className="border border-gray-300 p-2 text-left">수집목적</th>
                        <th className="border border-gray-300 p-2 text-left">보유기간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">영문성, 영문명, 주소, 이메일 수신 및 알림 서비스 동의여부, 직장명(또는 학교명), 직장주소, 직장전화번호</td>
                        <td className="border border-gray-300 p-2">마케팅 활동, 경품행사, 이벤트 정보제공, 이용고객 통계자료 작성 및 서비스 개발</td>
                        <td className="border border-gray-300 p-2">회원탈퇴 시까지</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보</td>
                        <td className="border border-gray-300 p-2">시스템 관련</td>
                        <td className="border border-gray-300 p-2">회원탈퇴 시까지</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  선택항목은 입력하지 않아도 회원가입이 가능합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보 수집방법 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-6 h-6 mr-2" />
              2. 개인정보 수집방법
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                당사에서 운영하는 홈페이지, 전화, 팩스등과 당사 상품을 판매하는 제휴처 홈페이지회원, 여행회원, 상담신청서, 상품예약(구매) 및 그 외 본인 확인, 제휴사로부터의 당사제공 등의 방법으로 개인정보를 수집합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보의 수집 및 이용목적 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="w-6 h-6 mr-2" />
              3. 개인정보의 수집 및 이용목적
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                당사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">가. 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>여행상품 예약, 여행자보험 가입, 항공권/호텔의 예약, 예약내역의 확인 및 상담, 컨텐츠 제공, 조회, 사용 및 이에 관한 안내, 구매 및 요금 결제, 물품배송 또는 청구지 등 발송, 본인인증 및 금융서비스, 구매 및 요금결제, 출국가능여부파악, 회원카드발급, 회원우대 등</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">나. 고객 관리</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>고객관리 및 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 이용 및 이용횟수 제한, 연령확인, 만 14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인, 분쟁조정을 위한 기록보존, 불만처리 등 민원처리, 고지사항 전달 등</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">다. 신규서비스 및 마케팅,광고에 활용</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 이벤트, 신상품 등 광고성 정보 전달 및 참여기회제공, 접속 빈도 파악, 서비스 이용에 대한 통계, 신규 및 제휴 비지니스 관련 서비스제공 및 각종 마케팅 활동 등. 위 정보는 가입 당시 정보만 아니라 정보 수정으로 변경된 정보를 포함 합니다.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보의 이용, 보유기간 및 파기 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trash2 className="w-6 h-6 mr-2" />
              4. 개인정보의 이용, 보유기간 및 파기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                당사는 고객님의 개인정보를 다음과 같이 수집목적 또는 제공받은 목적이 달성되거나 고객이 표명한 절차에 따라 탈퇴를 요청하거나 표명된 회원자격상실 사유에 의해 고객님의 자격을 제한 및 정지시키는 경우에는 해당 개인의 정보는 재생할 수 없는 기술적 방법을 통해 삭제되며, 어떠한 용도로도 열람 또는 이용할 수 없도록 파기됩니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원 정보를 보관 합니다.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="flex-shrink-0">5년</Badge>
                  <div>
                    <h4 className="font-medium">가. 계약 또는 청약철회 등에 관한 기록</h4>
                    <p className="text-sm text-gray-600">(전자상거래등에서의 소비자보호에 관한 법률)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="flex-shrink-0">5년</Badge>
                  <div>
                    <h4 className="font-medium">나. 대금결제 및 재화 등의 공급에 관한 기록</h4>
                    <p className="text-sm text-gray-600">(전자상거래등에서의 소비자보호에 관한 법률)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="flex-shrink-0">3년</Badge>
                  <div>
                    <h4 className="font-medium">다. 소비자의 불만 또는 분쟁처리에 관한 기록</h4>
                    <p className="text-sm text-gray-600">(전자상거래등에서의 소비자보호에 관한 법률)</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">▶ 파기방법 :</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>종이에 출력된 개인정보: 분쇄기를 이용하여 분쇄</li>
                  <li>전자적파일형태로 저장된 개인정보: 개인정보는 남기지 않으며, 기록을 재생할 수 없는 방법을 통하여 기록삭제</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보 제3자제공 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              5. 개인정보 제3자제공
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">원칙</h3>
                <p className="text-sm text-yellow-800">
                  당사는 고객님의 동의가 있거나 관련 법령의 규정에 의한 경우를 제외하고 어떠한 경우에도 '개인정보의 수집 및 이용목적' 에서 고지한 범위를 넘어 서비스와 무관한 타 기업/기관에 제공하거나 이용하지 않습니다.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">가. 제3자 제공 현황</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">제공대상</th>
                        <th className="border border-gray-300 p-2 text-left">제공하는 항목</th>
                        <th className="border border-gray-300 p-2 text-left">제공받는 자의 이용목적</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">대한항공,아시아나항공 및 국내외 제휴항공사, 철도,크루즈 및 운송업체</td>
                        <td className="border border-gray-300 p-2">성명(영문이름포함), 생년월일, 성별, 여권/비자 유무 및 관련 정보(여권만료일, 여권번호 등),투어마일리지정보, 회원종류</td>
                        <td className="border border-gray-300 p-2">항공권 및 기타운송업체 탑승예약,기타 편의 서비스제공</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">국내 외 호텔 및 리조트 /숙박업체/해외 랜드사</td>
                        <td className="border border-gray-300 p-2">성명(영문이름포함), 여권/비자 유무 및 관련 정보(여권만료일, 여권번호 등)</td>
                        <td className="border border-gray-300 p-2">항공권 및 기타운송업체 탑승예약,기타 편의 서비스제공</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">국내외 호텔 및 리조트 : 기타 숙박 에이전트</td>
                        <td className="border border-gray-300 p-2">성명(한글/영문), 성별, 연락처(이메일/휴대폰)</td>
                        <td className="border border-gray-300 p-2">숙박 및 호텔 예약관련 고객관리 목적</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">동부화재, 한화손해보험, KB손해보험, 메리츠화재</td>
                        <td className="border border-gray-300 p-2">성명, 자택전화번호, 휴대전화번호, 생년월일, 성별</td>
                        <td className="border border-gray-300 p-2">여행자보험가입, 제휴, 회원할인 및 기타 편의 서비스 제공</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">KCP</td>
                        <td className="border border-gray-300 p-2">이름, 가상계좌번호, 금액</td>
                        <td className="border border-gray-300 p-2">은행자동남부 인출업무 중계, 은행계좌인증</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">이니시스</td>
                        <td className="border border-gray-300 p-2">성명, 카드사명, 신용카드번호, 승인번호, 금액, 계좌번호, 이메일, 휴대폰</td>
                        <td className="border border-gray-300 p-2">신용카드 결제 및 실시간 계좌이체 서비스 목적</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">Hotel pass</td>
                        <td className="border border-gray-300 p-2">성명,영문명,이메일,연락처</td>
                        <td className="border border-gray-300 p-2">해외호텔예약상담</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">지정거래외국환은행</td>
                        <td className="border border-gray-300 p-2">성명, 생년월일, 성별</td>
                        <td className="border border-gray-300 p-2">외국환거래규정 준수</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  정보 보유 및 이용 기간 : 이용목적에 따른 개인정보 제공시, 이용목적 달성시 및 관계법령에 따른 보관기간까지 (제휴업체에는 제휴계약 종료시 까지)
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">나. 기타 제3자 제공</h3>
                <p className="text-sm text-gray-700 mb-2">
                  영업의 양수 등 영업의 전부 또는 일부를 양도하거나, 합병ㆍ상속 등으로 서비스 제공자의 권리ㆍ의무를 이전 승계하는 경우 개인정보보호 관련 고객의 권리를 보장하기 위하여 반드시 그 사실을 고객님에게 통지합니다. 이외에는 아래의 경우에 준합니다.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>형사소송법, 금융실명거래 및 비밀보장에 관한 법률, 신용정보의 이용 및 보호에 관한 법률, 지방세법, 소비자보호법, 한국은행법, 등 관계법령에 의하여 수사상의 목적으로 관계기관으로부터 요구가 있는 경우</li>
                  <li>통계작성 학술연구나 시장조사를 위하여 특정 개인을 식별할 수 없는 형태로 광고주, 협력사나 연구단체 등에 제공하는 경우</li>
                  <li>문화관광부 인증 우수상품에 관한 해당 관련기관의 요청이 있는 경우</li>
                  <li>서비스 제공에 따른 요금정산을 위하여 필요한 경우</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">다. 고객 맞춤 서비스</h3>
                <p className="text-sm text-gray-700">
                  고객님의 개인정보는 원활한 상담 진행 및 맞춤 여행상품 안내를 위한 정보제공 목적으로 아래와 같이 활용될 수 있습니다.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                  <li>당사는 고객님의 원활한 여행서비스를 위해 파트너 여행사와 상담센터를 운영하고 있으며 제휴사와 업무를 진행하고 고객님의 여행상품 상담과 진행에 관련하여 개인정보(성명, 연락처, 생일, 성별) 및 상품이용정보를 당사에서 제공한 관리시스템을 통해 당사와 계약된 협력사 및 제휴사에서 제한적으로 열람할 수 있도록 하고 있습니다.</li>
                  <li>당사의 여행상품 및 여행관련 서비스를 이용한 고객님에게 한정하여 기획여행상품이나 다양한 서비스를 홍보하고 안내 드리기 위하여 개인정보 제공 및 공유에 동의한 고객님에게 맞춤 서비스를 제공할 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보 취급위탁에 관한 사항 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              6. 개인정보 취급위탁에 관한 사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">가. 위탁업체 현황</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">수탁업체</th>
                        <th className="border border-gray-300 p-2 text-left">제공항목</th>
                        <th className="border border-gray-300 p-2 text-left">위탁 업무 내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">서울신용평가정보</td>
                        <td className="border border-gray-300 p-2">성명, 생년월일, 성별</td>
                        <td className="border border-gray-300 p-2">실명인증목적 아이핀 서비스</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">LG U+</td>
                        <td className="border border-gray-300 p-2">연락처</td>
                        <td className="border border-gray-300 p-2">MMS, SMS 발송</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">노랑투어</td>
                        <td className="border border-gray-300 p-2">성명(국영문), 계약여행상품내역, 연락처(휴대폰, e-mail주소)</td>
                        <td className="border border-gray-300 p-2">공항 송객,여행물품 전달</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2">투어소프트</td>
                        <td className="border border-gray-300 p-2">이름, 생년월일, 휴대전화번호</td>
                        <td className="border border-gray-300 p-2">회원정보관리 시스템 유지보수 업체</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  정보 보유 및 이용기간: 이용목적에 따른 개인정보 제공시, 이용목적 달성시 및 관계법령에 따른 보관기간까지 보관 후 지체없이 파기
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">나. 위탁 관리</h3>
                <p className="text-sm text-gray-700">
                  회사는 위탁계약 체결시 개인정보 보호법 제25조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적.관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리.감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">다. 위탁 변경 고지</h3>
                <p className="text-sm text-gray-700">
                  위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보의 열람, 정정, 동의 철회 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-6 h-6 mr-2" />
              7. 개인정보의 열람, 정정, 동의 철회
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                당사의 고객님 개인정보 열람 및 정정을 위해서는 홈페이지의 마이페이지내 회원정보 수정을 클릭하여 열람 또는 정정하실 수 있습니다. 당사는 개인정보에 대한 열람증명 또는 정정을 요구하는 경우 성실하게 대응합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 만14세 미만이용자 및 법정대리인의 권리와 그 행사 방법 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              8. 만14세 미만이용자 및 법정대리인의 권리와 그 행사 방법
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                만14세 미만 아동의 경우 (법정대리인 포함)는 언제든지 개인정보에 대한 열람, 정정을 요구하시거나 개인정보의 수집과 이용, 위탁 또는 제공에 대한 동의를 철회 하실 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 미성년자의 거래에 관한 계약 체결 및 취소 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              9. 미성년자의 거래에 관한 계약 체결 및 취소
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                당사는 미성년자와 재화 등의 거래에 관한 계약을 체결하고자 하는 경우에는 법정 대리인이 그 계약에 대해서 동의를 하지 아니하면 미성년자 본인 또는 법정대리인이 그 계약을 취소할 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              10. 개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                당사는 고객님의 정보를 수시로 저장하고 찾아내는 '쿠키(cookie)' 등을 운용합니다. 쿠키란 당사의 웹사이트를 운영하는데 이용되는 서버가 고객님의 브라우저에 보내는 아주 작은 텍스트 파일로서 고객님의 컴퓨터 하드디스크에 저장됩니다.
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">▶ 쿠키 등 사용 목적</h3>
                <p className="text-sm text-gray-700">
                  고객님과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">▶ 쿠키 설정 거부 방법</h3>
                <p className="text-sm text-gray-700 mb-2">
                  예: 쿠키 설정을 거부하는 방법으로는 고객님이 사용하시는 웹 브라우저의 옵션을 선택함으로써 모든 쿠키를 허용하거나 쿠키를 저장할 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
                </p>
                <p className="text-sm text-gray-700">
                  설정방법 예(인터넷 익스플로어의 경우): 웹 브라우저 상단의 도구 &gt; 인터넷 옵션 &gt; 개인정보
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  단, 고객님께서 쿠키 설치를 거부하였을 경우 서비스 제공에 어려움이 있을 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보보호를 위한 기술 및 관리대책 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              11. 개인정보보호를 위한 기술 및 관리대책
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">가. 개인정보 취급 직원의 최소화 및 교육</h3>
                  <p className="text-sm text-gray-600">개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">나. 정기적인 자체 감사 실시</h3>
                  <p className="text-sm text-gray-600">개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">다. 내부관리계획의 수립 및 시행</h3>
                  <p className="text-sm text-gray-600">개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">라. 개인정보의 암호화</h3>
                  <p className="text-sm text-gray-600">이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">마. 해킹 등에 대비한 기술적 대책</h3>
                  <p className="text-sm text-gray-600">이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">바. 개인정보에 대한 접근 제한</h3>
                  <p className="text-sm text-gray-600">개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">사. 접속기록의 보관 및 위변조 방지</h3>
                  <p className="text-sm text-gray-600">개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능 사용하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">아. 문서보안을 위한 잠금장치 사용</h3>
                  <p className="text-sm text-gray-600">개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">자. 비인가자에 대한 출입 통제</h3>
                  <p className="text-sm text-gray-600">개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">차. 수집하는 개인정보의 보유 및 이용기간</h3>
                  <p className="text-sm text-gray-600">회사는 회원의 개인정보를 서비스 이용시점부터 서비스를 제공하는 기간 동안에만 제한적으로 이용하고 있습니다.</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                    <li>1년간 회원의 서비스 이용기록이 없는 경우, 『정보통신망 이용촉진 및 정보보호등에 관한 법률』 제29조에 근거하여 회원에게 사전 통지하고 개인정보를 별도로 분리하여 휴면계정 전환일로부터 3년 간 저장합니다.</li>
                    <li>회원 탈퇴 또는 회원 자격 정지 후 회원 재가입, 임의해지 등을 반복적으로 행하여 회사가 제공하는 할인쿠폰, 이벤트 혜택 등으로 경제상의 이익을 취하거나 이 과정에서 명의를 무단으로 사용하는 등 편법행위 또는 불법행위를 하는 회원을 차단하고자 회사는 회원 탈퇴 후 90일 간 회원의 정보를 보관합니다.</li>
                    <li>본조 제2항 및 제3항에서 명시한 회원의 개인정보 보존기간이 경과되면, 회사는 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 외부 업체를 통하여 분쇄하고, 전자적 파일 형태로 저장된 개인정보는 재사용할 수 없도록 기술적 방법을 사용하여 삭제 처리합니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보 보호책임자 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              12. 개인정보 보호책임자
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">개인정보 보호책임자</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">성명:</span> 형송민
                      </div>
                      <div>
                        <span className="text-gray-600">연락처:</span> 02-722-3575
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">개인정보 관리담당자</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">성명:</span> 형송민
                      </div>
                      <div>
                        <span className="text-gray-600">연락처:</span> 02-722-3575
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 개인정보 보호책임자 연락처 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-6 h-6 mr-2" />
              13. 개인정보 보호책임자 연락처
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                가. 정보주체께서는 회사의 서비스(또는 사업)를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 주식회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
              </p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">○ 개인정보침해신고센터</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>전화: 118</div>
                    <div>이메일: 118@kisa.or.kr</div>
                    <div>URL: https://privacy.kisa.or.kr</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">○ 정보보호마크 인증위원회</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>전화: 02-550-9531</div>
                    <div>URL: https://www.eprivacy.or.kr</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">○ 대검찰청 인터넷범죄수사센터</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>전화: 02-3480-2000</div>
                    <div>URL: https://www.spo.go.kr</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">○ 경찰청 사이버 테러 대응 센터</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>전화: 02-363-0112</div>
                    <div>URL: https://www.ctrc.go.kr</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 고지의 의무 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-6 h-6 mr-2" />
              14. 고지의 의무
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                현 개인정보취급방침의 내용은 정부의 정책 또는 보안기술의 변경에 따라 내용의 추가 삭제 및 수정이 있을 시에는 홈페이지의 공지사항을 통해 고지할 것입니다. 이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">개인정보 처리방침 변경 이력</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>개인정보취급방침</span>
                    <span>2020. 07. 01</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
} 