import { useState } from "react";
import { updateUser } from "../../api/myPageApi";

type UserInfo = {
    userId: number;
    loginId: string;
    name: string;
    nickname: string;
    email: string;
    phone: string;
    profileImage: string | null;
    createdAt?: string;
};

type ProfileEditPageProps = {
    user: UserInfo;
};

function ProfileEditPage({ user }: ProfileEditPageProps) {
    const [profileFile, setProfileFile] = useState<File | null>(null);
    
    const [form, setForm] = useState({
        loginId: user.loginId,
        email: user.email,
        createdAt: user.createdAt || "",
        nickname: user.nickname,
        phone: user.phone || "",
        password: "",
        passwordConfirm: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (form.password !== form.passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("nickname", form.nickname);
            formData.append("phone", form.phone);
            formData.append("name", user.name);
            formData.append("email", user.email);

            if (profileFile) {
                formData.append("files", profileFile);
            }

            if (form.password.trim() !== "") {
                formData.append("password", form.password);
            }

            for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

            await updateUser(user.userId, formData);

            alert("회원정보가 수정되었습니다.");
        } catch (err) {
            console.log("회원정보 수정 실패:", err);
            alert("회원정보 수정에 실패했습니다.");
        }
    };

    return (
        <div className="bg-white border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">회원정보 수정</h2>

            <section className="border-b pb-5 mb-5">
                <h3 className="text-lg font-bold mb-4">기본 정보</h3>

                <div className="space-y-3">
                    <div className="flex">
                        <span className="w-32 font-bold">아이디</span>
                        <span>{form.loginId}</span>
                    </div>

                    <div className="flex">
                        <span className="w-32 font-bold">이메일</span>
                        <span>{form.email}</span>
                    </div>

                    <div className="flex">
                        <span className="w-32 font-bold">가입일</span>
                        <span>{form.createdAt}</span>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-4">수정 정보</h3>

                <div className="space-y-4 max-w-xl">
                    <div>
                        <label className="block font-bold mb-1">
                            프로필 이미지
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (file) {
                                    setProfileFile(file);
                                }
                            }}
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-1">닉네임</label>
                        <input
                            type="text"
                            name="nickname"
                            value={form.nickname}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-1">전화번호</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    
                    <div className="text-sm text-gray-500">
                        비밀번호 변경은 로그인 화면의
                        "비밀번호 찾기" 기능을 이용해주세요.
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white rounded px-6 py-2 hover:bg-blue-600"
                    >
                        수정하기
                    </button>
                </div>
            </section>
        </div>

        
    );

    
}

export default ProfileEditPage;