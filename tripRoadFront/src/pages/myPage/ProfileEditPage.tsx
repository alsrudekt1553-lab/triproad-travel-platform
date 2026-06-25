import { useState } from "react";
import { updateUser } from "../../api/myPageApi";
import { formatDate } from "../../utils/dateFormat";

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
        phone: user.phone || ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async () => {

        try {
            const formData = new FormData();

            formData.append("nickname", form.nickname);
            formData.append("phone", form.phone);
            formData.append("name", user.name);
            formData.append("email", user.email);

            if (profileFile) {
                formData.append("files", profileFile);
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
        <div className="border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-neutral-900">
                    회원정보 수정
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                    프로필 이미지와 회원 정보를 관리할 수 있습니다.
                </p>
            </div>

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
                        <span>{formatDate(form.createdAt)}</span>
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
                            className="h-11 w-full border border-neutral-300 bg-white px-4 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-1">전화번호</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="h-11 w-full border border-neutral-300 bg-white px-4 text-sm outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="rounded-full bg-sky-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-800"
                    >
                        수정하기
                    </button>
                </div>
            </section>
        </div>

        
    );

    
}

export default ProfileEditPage;