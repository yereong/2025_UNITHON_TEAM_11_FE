'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import CommonButton from '@/components/CommonButton';
import DefaultBody from '@/components/defaultBody';
import DefaultInput from '@/components/DefaultInput';
import { GetNickname } from '@/api/getNickname';
import { PostSignup } from '@/api/postSignup';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { profile } from 'console';

export default function SignUpProfilePage() {
  const router = useRouter();
  const { userInfo, setUserInfo } = useUser();
  const [profileImg, setProfileImg] = useState<File | null>(null); // 프로필 이미지 상태 수정
  const [imgPrev, setImgPrev] = useState<string>('');
  const [nickname, setNickname] = useState('');
  const [intro, setIntro] = useState('');
  const [ nicknameOk, setNicknameOk] = useState(false)
  const [ nicknameCheckMessage, setNicknameCheckMessage] = useState('');
  const isFilled = intro && nicknameOk;

   useEffect(() => {
    return () => {
      if (imgPrev) {
        URL.revokeObjectURL(imgPrev);
      }
    };
  }, [imgPrev]);

   const handleNicknameCheck = async () => {
    try {
      await GetNickname(nickname);
      setNicknameOk(true);
      setNicknameCheckMessage('사용가능한 닉네임입니다');
    } catch (error) {
      setNicknameOk(false);
      setNicknameCheckMessage('중복된 닉네임입니다');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const file = e.target.files[0];
      setProfileImg(file);
      if (imgPrev) {
        URL.revokeObjectURL(imgPrev);
      }
      setImgPrev(URL.createObjectURL(file));
      console.log(URL.createObjectURL(file));
    }
  };

  const handleSignup = async() => {
    try {
      const response = await PostSignup(userInfo.email, userInfo.id, userInfo.password, nickname, intro, profileImg);
      console.log('회원가입 결과:', response);
        alert('회원가입 완료! 다시 로그인해주세요');
        router.push('/login');
    } catch (error: any) {
      console.error("회원가입 실패", error);
      const message = error.response?.data?.message || "회원가입 실패";
      alert(message);
    }
  }
  return (
    <>
      <Header>
        <Header.BackButton />
        <Header.Title>회원가입</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="flex flex-col  ">
          {/* 본문 영역 */}
          <main className="flex flex-col items-center mt-[24px]">
            <h1 className="flex flex-col font-pretendard font-normal text-[20px] leading-[135%] tracking-[-0.03em] mb-[32px] w-full max-w-[350px] ">
              프링에서 사용할 <br />
              <span>
                <span className='font-pretendard font-semibold text-[20px] leading-[135%] tracking-[-0.03em]'>프로필</span>
                을 완성해주세요!
              </span>
              <div className='font-medium text-[14px] leading-[19px] tracking-tight text-gray-400 flex-none order-1 flex-grow-0 mt-[8px]'>지금 설정한 프로필은 언제든지 변경이 가능해요.</div>
            </h1>
            
        <div className="flex w-full max-w-[350px]  flex-col  jusgap-2">
          

          <div className='w-[80px] h-[80px] self-center'>
            <label htmlFor='profileImgBtn1'>
                <img  className='rounded-full w-[80px] h-[80px]' src={imgPrev ? imgPrev : "/asset/addProfile.svg"} alt='프로필 이미지'></img>
                <input id='profileImgBtn1' type='file' className="hidden" accept='image/*' onChange={handleImageChange} />
            </label>
          </div>

           <p className="mt-[40px] mb-[8px] font-pretendard font-medium text-[15px] leading-[145%] tracking-[-0.03em]">닉네임 입력</p>
                      <DefaultInput
                          type="text"
                          placeholder="닉네임을 입력해주세요!"
                          value={nickname}
                          onChange={e => setNickname(e.target.value)}
                          onCheck={()=> handleNicknameCheck()}
                          showCheckButton={true}
                          />
                          {nicknameCheckMessage && (
                            <p className={`mt-2 font-pretendard text-[13px] leading-[135%] tracking-[-0.03em] ${nicknameOk ? 'text-[#4BE42C]' : 'text-[#FF6B2C]'}`}>
                                {nicknameCheckMessage}
                            </p>
                            )}
      
            <p className="flex mt-[32px] mb-[8px] font-pretendard font-medium text-[15px] leading-[145%] tracking-[-0.03em]">소개글 입력</p>
              <textarea
                placeholder="소개글을 입력해주세요!"
                value={intro}
                onChange={e => setIntro(e.target.value)}
                className='w-full h-[96px] px-4 py-4 resize-none flex felx-start items-start text-start rounded-[8px] border border-[#DFD7CF] bg-white placeholder:text-[#bdbdbd] font-pretendard font-medium text-[14px] leading-[100%] tracking-[-0.03em] focus:outline-none'
                >
                          </textarea>
         
            {/* 하단 버튼 영역 */}
             <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[372px] bg-[#FFFDFB]  p-4 [box-shadow:0px_-1px_4px_0px_#00000008] rounded-[12px]">
                <CommonButton
                    type="button"
                    disabled={!isFilled}    
                    
                    onClick={()=> handleSignup()}
                    >
                        다음
                </CommonButton>
            </div>
        </div> 
        </main>
        </div>
      </DefaultBody>
    </>
  );
}
