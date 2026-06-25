import { useState } from "react";
import axios from "axios";
import { changePassword } from "../../api/myPageApi";

function ChangePasswordPage() {
	const [currentPassword, setCurrentPassword] =
		useState("");
	const [newPassword, setNewPassword] =
		useState("");
	const [newPasswordConfirm, setNewPasswordConfirm] =
		useState("");
	const [pending, setPending] = useState(false);

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();

		if (!currentPassword) {
			alert("현재 비밀번호를 입력해주세요.");
			return;
		}

		if (!newPassword || !newPasswordConfirm) {
			alert("새 비밀번호를 입력해주세요.");
			return;
		}

		if (newPassword !== newPasswordConfirm) {
			alert("새 비밀번호가 일치하지 않습니다.");
			return;
		}

		if (currentPassword === newPassword) {
			alert(
				"새 비밀번호는 현재 비밀번호와 다르게 입력해주세요."
			);
			return;
		}

		try {
			setPending(true);

			const result = await changePassword(
				currentPassword,
				newPassword
			);

			alert(
				result.MESSAGE ||
					"비밀번호가 변경되었습니다."
			);

			setCurrentPassword("");
			setNewPassword("");
			setNewPasswordConfirm("");
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				alert(
					error.response?.data?.MESSAGE ||
						"비밀번호 변경에 실패했습니다."
				);
			} else {
				alert("비밀번호 변경에 실패했습니다.");
			}
		} finally {
			setPending(false);
		}
	};

	return (
		<div className="border border-neutral-200 bg-white p-6 shadow-sm">
			<div className="mb-6">
				<h2 className="text-xl font-extrabold text-neutral-900">
					비밀번호 변경
				</h2>

				<p className="mt-1 text-sm text-neutral-500">
					계정 보호를 위해 현재 비밀번호를 확인합니다.
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="max-w-xl space-y-5"
			>
				<div>
					<label
						htmlFor="currentPassword"
						className="mb-2 block text-sm font-bold text-neutral-700"
					>
						현재 비밀번호
					</label>

					<input
						id="currentPassword"
						type="password"
						value={currentPassword}
						autoComplete="current-password"
						onChange={(e) =>
							setCurrentPassword(e.target.value)
						}
						className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="newPassword"
						className="mb-2 block text-sm font-bold text-neutral-700"
					>
						새 비밀번호
					</label>

					<input
						id="newPassword"
						type="password"
						value={newPassword}
						autoComplete="new-password"
						onChange={(e) =>
							setNewPassword(e.target.value)
						}
						className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="newPasswordConfirm"
						className="mb-2 block text-sm font-bold text-neutral-700"
					>
						새 비밀번호 확인
					</label>

					<input
						id="newPasswordConfirm"
						type="password"
						value={newPasswordConfirm}
						autoComplete="new-password"
						onChange={(e) =>
							setNewPasswordConfirm(
								e.target.value
							)
						}
						className="h-11 w-full border border-neutral-300 px-4 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
						required
					/>
				</div>

				<button
					type="submit"
					disabled={pending}
					className="rounded-full bg-sky-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
				>
					{pending
						? "변경 중..."
						: "비밀번호 변경"}
				</button>
			</form>
		</div>
	);
}

export default ChangePasswordPage;