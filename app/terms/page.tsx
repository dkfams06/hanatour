import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            서비스 이용약관
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              이용약관
            </h2>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제1조(약관)</h3>
              <p className="text-gray-600 leading-relaxed">
                이 약관은 당사에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 한다)를 이용함에 있어 사이·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                ※ PC통신, 모바일 무선 등을 이용하는 전자거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제2조(정의)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"란 여행사가 재화 또는 용역(이하 "재화 등"이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버 투어를 운영하는 사업자의 의미로도 사용합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "이용자"란 "당사"홈페이지에 접속하여 이 약관에 따라 "당사"가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ "회원"이라 함은 "당사"에 개인정보를 제공하여 회원등록을 한 자로서, "당사"의 정보를 지속적으로 제공받으며, "당사"가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ④ "비회원"이라 함은 회원에 가입하지 않고 "당사"가 제공하는 서비스를 이용하는 자를 말합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제3조(약관의 명시와 개정)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지, 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 모사전송번호, 전자우편주소, 사업자등록번호, 통신판매업신고번호, 개인정보관리책임자 등을 이용자가 쉽게 알 수 있도록 "당사" 홈페이지의 초기 서비스화면(전면)에 게시합니다. 다만 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회·배송책임·환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ "당사"는 전자상거래등에서의소비자보호에관한법률, 약관의규제에관한법률, 전자거래기본법, 전자서명법, 정보통신망이용촉진등에 관한법률, 방문판매등에관한법률, 소비자보호법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ④ "당사"가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 "당사"홈페이지의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이전의 유예기간을 두고 공지합니다. 이 경우 "당사"는 개정 전 내용과 개정 후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ⑤ "당사"가 약관을 개정할 경우에는 그 개정약관은 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정 약관의 공지기간 내에 "당사"에 송신하여 동의를 받은 경우에는 개정약관 조항이 적용됩니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ⑥ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래등에서의소비자보호에관한법률, 약관의규제등에관한법률, 정부가 제정한 전자상거래 등에서의 소비자보호지침 및 관계법령 또는 상 관례에 따릅니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제4조(서비스의 제공 및 변경)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 다음과 같은 업무를 수행합니다.
                </p>
                <div className="ml-6 space-y-2">
                  <p className="text-gray-600">1. 재화 또는 용역 등에 대한 정보 제공 및 계약의 체결</p>
                  <p className="text-gray-600">2. 계약이 체결된 재화 또는 용역 등의 배송</p>
                  <p className="text-gray-600">3. 기타 "당사"가 정하는 업무</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공일자를 명시하여 현재의 재화 또는 용역의 내용을 게시한 곳에 즉시 공지합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ⑤ "당사"가 제공하기로 이용자와 계약을 체결한 서비스의 내용을 재화 등의 품절 또는 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로 즉시 통지합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ⑥ 전항의 경우 "당사"는 이로 인하여 이용자가 입은 인과관계가 입증된 실제 손해를 배상합니다. 다만, "당사"가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제5조(서비스의 중단)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 컴퓨터 등 정보통신설비의 보수 점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단 "당사"에 고의 또는 과실이 없는 경우에는 그러하지 아니합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ 사업종목의 전환, 사업의 포기, 업체간 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 "당사"는 제8조에 정한 방법으로 이용자에게 통지하고 당초 "당사"에서 제시한 조건에 따라 소비자에게 보상합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제6조(회원가입)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① 이용자는 "당사"가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                </p>
                <div className="ml-6 space-y-2">
                  <p className="text-gray-600">1. 가입신청자가 이 약관 제7조제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우, 다만 제7조제3항에 의한 회원자격 상실 후 3년이 경과한 자로서 "당사"의 회원 재가입 승낙을 얻은 경우에는 예외로 한다.</p>
                  <p className="text-gray-600">2. 등록 내용에 허위, 기재누락, 오기가 있는 경우</p>
                  <p className="text-gray-600">3. 기타 회원으로 등록하는 것이 "당사"의 기술상 현저히 지장이 있다고 판단되는 경우</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  ③ 회원가입의 성립시기는 "당사"의 승낙이 회원에게 도달한 시점으로 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ④ 회원은 제 16조 제 1항에 의한 등록사항에 변경이 있는 경우, 즉시 전자우편 및 기타 방법으로 "당사"에 그 변경사항을 알려야 합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제7조(회원 탈퇴 및 자격 상실 등)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① 회원은 "당사"에 언제든지 탈퇴를 요청할 수 있으며 "당사"는 즉시 회원 탈퇴를 처리합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② 회원이 다음 각 호의 사유에 해당하는 경우, "당사"는 회원자격을 제한 및 정지시킬 수 있습니다.
                </p>
                <div className="ml-6 space-y-2">
                  <p className="text-gray-600">1. 가입 신청 시에 허위 내용을 등록한 경우</p>
                  <p className="text-gray-600">2. "당사"를 이용하여 구입한 재화 등의 대금, 기타 "당사"이용에 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우</p>
                  <p className="text-gray-600">3. 다른 사람의 "당사" 이용을 방해하거나 그 정보를 도용하는 등 전자상거래질서를 위협하는 경우</p>
                  <p className="text-gray-600">4. "당사"를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</p>
                  <p className="text-gray-600">5. 기타 다음과 같은 행위 등으로 "당사"의 건전한 운영을 해하거나 "당사"의 업무를 방해하는 경우</p>
                </div>
                <div className="ml-8 space-y-2">
                  <p className="text-gray-600">가. "당사"의 운영에 관련하여 근거 없는 사실 또는 허위의 사실을 적시하거나 유포하여 "당사"의 명예를 실추시키고 "당사"의 신뢰성을 해하는 경우</p>
                  <p className="text-gray-600">나. "당사"의 운영과정에서 직원에게 폭언 또는 음란한 언행을 하여 업무환경을 심각히 해하는 경우</p>
                  <p className="text-gray-600">다. "당사"의 운영과정에서 이유 없는 잦은 연락이나 소란 또는 협박, 인과관계가 입증되지 않는 피해에 대한 보상(적립금, 현금, 상품)요구 등으로 업무를 방해하는 경우</p>
                  <p className="text-gray-600">라. "당사"를 통해 구입한 상품 또는 용역에 특별한 하자가 없는데도 불구하고 일부 사용 후 상습적인 취소·전부 또는 일부 반품 등으로 회사의 업무를 방해하는 경우. 단, 당해 회원의 취소 반품비율이 회사의 평균 취소 반품율보다 50%이상 높을 경우에는 상습적인 것으로 인정될 수 있습니다</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  ③ "당사"가 회원 자격을 제한·정지 시킨 후 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 "당사"는 회원자격을 상실시킬 수 있습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ⑤ "당사"가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제8조(회원에 대한 통지)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"가 회원에 대한 통지를 하는 경우, 회원이 "당사"와 미리 약정한 전자우편 주소로 할 수 있습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 불특정다수 회원에 대한 통지의 경우 1주일이상 "당사" 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별통지를 합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제9조(구매신청)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                "당사" 이용자는 "당사"상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, "당사"는 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다. 단, 회원인 경우 제2호내지 제4호의 적용을 제외할 수 있습니다.
              </p>
              <div className="ml-6 space-y-2">
                <p className="text-gray-600">1. 재화 등의 검색 및 선택</p>
                <p className="text-gray-600">2. 성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호)등의 입력</p>
                <p className="text-gray-600">3. 약관내용, 청약철회권이 제한되는 서비스, 배송료, 설치비 등의 비용 부담과 관련한 내용에 대한 확인</p>
                <p className="text-gray-600">4. 이 약관에 동의하고 제3호의 사항을 확인하거나 거부하는 표시(예, 마우스 클릭)</p>
                <p className="text-gray-600">5. 재화 등의 구매신청 및 이에 관한 확인 또는 "당사"의 확인에 대한 동의</p>
                <p className="text-gray-600">6. 결제방법의 선택</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제10조(계약의 성립)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 제9조와 같은 구매신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수 있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정대리인의 동의를 얻지 못하면 미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다는 내용을 고지하여야 합니다.
                </p>
                <div className="ml-6 space-y-2">
                  <p className="text-gray-600">1. 신청내용에 허위, 기재누락, 오기가 있는 경우</p>
                  <p className="text-gray-600">2. 미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우</p>
                  <p className="text-gray-600">3. 기타 구매신청에 승낙하는 것이 "당사" 기술상 현저히 지장이 있다고 판단하는 경우</p>
                  <p className="text-gray-600">4. 신용카드 결제 시 소유주의 동의를 얻지 않는 불법행위로 추정 또는 확인되었을 경우</p>
                  <p className="text-gray-600">5. 구매 신청 고객이 제 7조에 따른 회원 자격 제한 ·정지 고객임이 확인되었을 경우</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"의 승낙이 제12조 제1항의 수신확인통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ "당사"의 승낙의 의사표시에는 이용자의 구매 신청에 대한 확인 및 판매가능 여부, 구매신청의 정정 취소 등에 관한 정보를 포함하여야 합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제11조(대금지급방법)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                "당사"에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각 호의 방법 중 가용한 방법으로 할 수 있습니다. 단,"당사"는 이용자의 지급방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도 추가하여 징수할 수 없습니다.
              </p>
              <div className="ml-6 space-y-2">
                <p className="text-gray-600">1. 온라인무통장입금</p>
                <p className="text-gray-600">2. 선불카드, 직불카드, 신용카드 등의 각종 카드 결제</p>
                <p className="text-gray-600">3. 당사 내사방문후 대금지급</p>
                <p className="text-gray-600">4. 여행상품권에 의한 결제</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제12조(수신확인통지/구매신청 변경 및 취소)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② 수신확인통지를 받은 이용자는 의사표시의 불일치 등이 있는 경우에는 수신확인통지를 받은 후 즉시 구매신청 변경 및 취소를 요청할 수 있고 "당사"는 배송 전에 이용자의 요청이 있는 경우에는 지체 없이 그 요청에 따라 처리하여야 합니다. 다만, 이미 대금을 지불한 경우에는 제15조의 청약철회 등에 관한 규정에 따릅니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제13조(재화 등의 공급)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 이용자와 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, "당사"가 이미 재화 등의 대금의 전부 또는 일부를 받은 경우에는 대금의 전부 또는 일부를 받은 날부터 2영업일 이내에 조치를 취합니다. 이때 "당사"는 이용자가 재화 등의 공급 절차 및 진행사항을 확인할 수 있도록 적절한 조치를 합니다. 여행상품과 같은 무형의 재화 공급은 해당 상품에 적용되는 별도의 약관을 교부하고 해당 서비스가 차질 없이 진행되도록 일련의 조치를 하여야 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별 배송기간 등을 명시합니다. 만약 "당사"가 약정 배송기간을 초과한 경우에는 그로 인한 이용자의 손해를 배상하여야 합니다. 다만, "당사"가 고의 과실이 없음을 입증한 경우에는 그러하지 아니합니다. 여행상품과 같은 무형의 재화 공급은 예약한 상품에 대한 별도의 여행자 계약서 등을 교부하여 이용자가 상기 상품의 구매와 이용에 대해 숙지할 수 있도록 하여야 합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제14조(환급)</h3>
              <p className="text-gray-600 leading-relaxed">
                "당사"는 이용자가 구매신청 한 재화 등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체 없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 2영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다. 다만, 여행상품의 경우 상품의 특성 상 이용자가 출발일 전 모든 예약이 완료된 이후 계약을 해지할 경우 국내(외) 여행표준약관 및 국내(외) 소비자 피해보상규정에 의거 손해 배상액을 공제하고 환불하며, 기타 상품의 상품이용 계약체결 시 계약한 특별약관 등의 규정에 의거한 상품의 취소 및 환불 수수료를 공제 후 환불합니다.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제15조(청약철회 등)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"와 재화 등의 구매에 관한 계약을 체결한 이용자는 수신확인의 통지를 받은 날부터 7일 이내에는 청약의 철회를 할 수 있습니다. 다만, 여행상품의 경우 국내(외) 여행표준약관에 의한 환급기준에 따라 별도의 취소수수료가 부과될 수 있습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② 이용자는 재화 등을 배송 받은 경우 다음 각 호의 경우에는 청약철회 및 교환을 할 수 없습니다.
                </p>
                <div className="ml-6 space-y-2">
                  <p className="text-gray-600">1. 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우<br/>(다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우에는 사전에 청약철회 제한에 관해 고지하지 않은 한 청약철회 등을 할 수 있습니다.)</p>
                  <p className="text-gray-600">2. 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우</p>
                  <p className="text-gray-600">3. 시간의 경과에 의하여 재판매가 곤란할 정도로 재화 등의 가치가 현저히 감소한 경우</p>
                  <p className="text-gray-600">4. 같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  ③ 제2항 제2호 내지 제4호의 경우에 "당사"가 사전에 청약철회 등이 제한되는 사실을 소비자가 쉽게 알 수 있는 곳에 명기하거나 시용상품을 제공하는 등의 조치를 하지 않았다면 이용자의 청약철회 등이 제한되지 않습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ④ 이용자는 제1항 및 제2항의 규정에 불구하고 재화 등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행된 때에는 당해 재화 등을 공급 받은 날부터 3월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약철회 등을 할 수 있습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제16조(청약철회 등의 효과)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 이용자로부터 재화 등을 반환 받은 경우 3영업일 이내에 이미 지급 받은 재화 등의 대금을 환급합니다. 이 경우 "당사"이 이용자에게 재화 등의 환급을 지연한 때에는 그 지연기간에 대하여 공정거래위원회가 정하여 고시하는 지연이자율을 곱하여 산정한 지연이자를 지급합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 위 대금을 환급함에 있어서 이용자가 신용카드 또는 전자화폐 등의 결제수단으로 재화 등의 대금을 지급한 때에는 지체 없이 당해 결제수단을 제공한 사업자로 하여금 재화 등의 대금의 청구를 정지 또는 취소하도록 요청합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ 청약철회 등의 경우 공급 받은 재화 등의 반환에 필요한 비용은 이용자가 부담합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ④ 이용자가 재화 등을 제공받을 때 발송비를 부담한 경우에 "당사"는 청약철회 시 그 비용을 누가 부담하는지를 이용자가 알기 쉽도록 명확하게 표시합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제17조(개인정보취급방침)</h3>
              <p className="text-gray-600 leading-relaxed">
                개인정보보호에 관한 사항은 투어에 게시된 당사의 개인정보보호정책에 규정된 내용에 따릅니다.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제18조("당사"의 의무)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고 안정적으로 재화·용역을 제공하는 데 최선을 다하여야 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안시스템을 갖추어야 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ "당사"가 상품이나 용역에 대하여 「표시·광고의공정화에관한법률」제3조 소정의 부당한 표시·광고행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제19조(회원의 ID 및 비밀번호에 대한 의무)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① 제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안 됩니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ 회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 "당사"에 통보하고 "당사"의 안내가 있는 경우에는 그에 따라야 합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제20조(이용자의 의무)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                이용자는 다음 행위를 하여서는 안 됩니다.
              </p>
              <div className="ml-6 space-y-2">
                <p className="text-gray-600">1. 신청 또는 변경 시 허위내용의 등록</p>
                <p className="text-gray-600">2. 타인의 정보 도용</p>
                <p className="text-gray-600">3. "당사"에 게시된 정보의 변경</p>
                <p className="text-gray-600">4. "당사"가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</p>
                <p className="text-gray-600">5. "당사" 기타 제3자의 저작권 등 지적재산권에 대한 침해</p>
                <p className="text-gray-600">6. "당사" 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</p>
                <p className="text-gray-600">7. 외설 또는 폭력적인 메시지·화상·음성·기타 공서양속에 반하는 정보를 투어에 공개 또는 게시하는 행위</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제21조(연결 "당사"과 피연결 "당사" 간의 관계)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① 상위 "당사"과 하위 "당사"이 하이퍼 링크(예: 하이퍼 링크의 대상에는 문자, 그림 및 동화상 등이 포함됨 ) 방식 등으로 연결된 경우, 전자를 연결 "당사"(웹사이트)이라고 하고 후자를 피연결 "당사"(웹사이트)라고 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② 연결 "당사"는 피연결 "당사"가 독자적으로 제공하는 재화 등에 의하여 이용자와 행하는 거래에 대해서 보증책임을 지지 않는다는 뜻을 피연결 "당사"의 초기화면 또는 연결되는 시점의 팝업화면으로 명시한 경우에는 그 거래에 대한 보증책임을 지지 않습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제22조(저작권의 귀속 및 이용제한)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"가 작성한 저작물에 대한 저작권, 기타 지적재산권은 "당사"에 귀속합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② 이용자는 "당사"를 이용함으로써 얻은 정보 중 "당사"에게 지적재산권이 귀속된 정보를 "당사"의 사전승낙 없이 복제, 송신, 출판, 배포, 방송, 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ "당사"는 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ④ 이용자는 "당사"가 제공하는 각종 서비스 등을 이용하는 과정에서 "당사"에 게시 또는 등록한 각종 저작물을 "당사"가 무상으로 사용하는 것을 허락하며, 이는 이용자가 회원을 탈퇴한 경우에도 유효합니다. 단, 이용자가 "당사"에 대해 상기 사용권의 허락을 취소하는 통지를 한 경우에는 그러하지 아니합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제23조(회원의 게시물 및 저작권)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① 게시물이라 함은 회원이 서비스를 이용하면서 게시한 글, 사진, 각종 파일과 링크 등을 말합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② 회원의 게시물에 의한 손해나 기타 문제가 발생하는 경우, 회원은 이에 대한 책임을 지게 되며, "당사"는 책임을 지지 않습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ "당사"는 다음 각 호에 해당하는 게시물 등을 회원의 사전 동의 없이 임의 게시, 중단, 수정, 삭제, 이동 또는 등록 거부 등의 관련 조치를 할 수 있습니다.
                </p>
                <div className="ml-6 space-y-2">
                  <p className="text-gray-600">- 다른 회원 또는 제 3자에게 심한 모욕을 주거나 명예를 손상시키는 내용인 경우</p>
                  <p className="text-gray-600">- 공공질서 및 미풍양속에 위반되는 내용을 유포하거나 링크시키는 경우</p>
                  <p className="text-gray-600">- 불법복제 또는 해킹을 조장하는 내용인 경우</p>
                  <p className="text-gray-600">- 제 3자의 저작권을 침해하여 게시중단 요청을 받은 경우</p>
                  <p className="text-gray-600">- 영리를 목적으로 하는 광고일 경우</p>
                  <p className="text-gray-600">- 범죄와 결부된다고 객관적으로 인정되는 내용일 경우</p>
                  <p className="text-gray-600">- 다른 이용자 또는 제 3자의 저작권 등 기타 권리를 침해하는 내용인 경우</p>
                  <p className="text-gray-600">- 사적인 정치적 판단이나 종교적 견해의 내용으로 회사가 서비스 성격에 부합하지 않는다고 판단하는 경우</p>
                  <p className="text-gray-600">- 회사에서 규정한 게시물 원칙에 어긋나거나, 게시판 성격에 부합하지 않는 경우</p>
                  <p className="text-gray-600">- 기타 관계법령에 위배된다고 판단되는 경우</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  ④ 회원이 게시한 게시물의 저작권은 게시한 회원에게 귀속됩니다. 단, "당사"는 서비스의 운영, 전시, 전송, 배포, 홍보의 목적으로 회원의 별도 허락 없이 무상으로 저작권법에 규정하는 공정한 관행에 합치되게 회원의 게시물을 사용할 수 있습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ⑤ "당사"는 전항 이외의 방법으로 회원의 게시물을 이용하고자 하는 경우, 전화, 팩스, 전자우편 등의 방법을 통해 사전에 회원의 동의를 얻어야 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ⑥ 회원이 이용계약 해지를 한 경우 타인에 의해 보관, 담기 등으로 재게시 되거나 복제된 게시물과 타인의 게시물과 결합되어 제공되는 게시물, 공용 게시판에 등록된 게시물 등은 삭제되지 않습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제24조(분쟁해결)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ③ "당사"와 이용자간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제25조(재판권 및 준거법)</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  ① "당사"와 이용자간에 발생한 전자상거래 분쟁에 관한 소송은 "당사"가 소재하는 법원의 전속관할로 합니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  ② "당사"와 이용자간에 제기된 전자상거래 소송에는 한국법을 적용합니다.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">제26조(특별규정)</h3>
              <p className="text-gray-600 leading-relaxed">
                ① 당 약관에 명시되지 않은 사항은 전자거래기본법, 전자서명법, 전자성거래 등에서의 소비자보호에 관한 법률, 기타 관련법령의 규정 및 국내(외) 여행표준약관 등에 의합니다.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">[부칙]</h3>
              <div className="space-y-2">
                <p className="text-gray-600">1. 본 약관은 2014년 7월 1일부터 적용됩니다.</p>
                <p className="text-gray-600">2. 2014년 7월 1일 이전에 시행된 종전의 약관은 본 약관으로 대체합니다</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 