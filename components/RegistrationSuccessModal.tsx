'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Mail } from 'lucide-react';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function RegistrationSuccessModal({ 
  isOpen, 
  onClose, 
  userEmail 
}: RegistrationSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
            <CheckCircle className="w-8 h-8" />
            회원가입 완료
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 가입완료 안내 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">가입완료</h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  회원가입이 완료되었습니다. 지금 바로 로그인하실 수 있습니다!
                </p>
              </div>
            </div>
          </div>

          {/* 이메일 안내 */}
          {userEmail && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">가입 확인 이메일</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>{userEmail}</strong>로 가입 확인 이메일을 발송했습니다.
                    스팸메일함도 확인해주세요.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 안내사항 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">안내사항</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>회원가입이 완료되었습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>지금 바로 로그인하여 서비스를 이용하실 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                <span>문의사항이 있으시면 고객센터로 연락해주세요.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
