import { useEffect, useState } from "react";
import {
    getChecklists,
    getChecklistItems,
    addChecklist as addChecklistApi,
    updateChecklist as updateChecklistApi,
    deleteChecklist as deleteChecklistApi,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
} from "../../api/myPageApi";

import {
	getBookingsByUser,
	getScheduleForBooking,
	type BookingInfo,
	type MyPageBookingSchedule,
} from "../../api/myPageBookingApi";

type ChecklistPageProps = {
    userId: number;
};

type TripStatus = "upcoming" | "ongoing";

type Trip = {
    bookingId: number;
    title: string;
    startDate: string;
    endDate: string;
    status: TripStatus;
};

type ChecklistItem = {
    itemId: number;
    itemName: string;
    isChecked: number;
};

type Checklist = {
    checklistId: number;
    userId?: number;
    bookingId?: number | null;
    title: string;
    items: ChecklistItem[];
};

function ChecklistPage({ userId }: ChecklistPageProps) {
    const [tripStatus, setTripStatus] = useState<TripStatus>("upcoming");
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [newItems, setNewItems] = useState<{ [key: number]: string }>({});

    const [trips, setTrips] = useState<Trip[]>([]);

    const filteredTrips = trips.filter(
        (trip) => trip.status === tripStatus
    );

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const bookings = await getBookingsByUser(userId);

                const activeBookings = bookings.filter(
                    (booking: BookingInfo) => booking.status !== 900
                );

                const convertedTrips = await Promise.all(
                    activeBookings.map(
                        async (booking): Promise<Trip | null> => {
                            const schedule: MyPageBookingSchedule =
                                await getScheduleForBooking(
                                    booking.scheduleId
                                );

                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            const startDate = new Date(
                                `${schedule.startDate.slice(0, 10)}T00:00:00`
                            );

                            const endDate = new Date(
                                `${schedule.endDate.slice(0, 10)}T00:00:00`
                            );

                            if (endDate < today) {
                                return null;
                            }

                            return {
                                bookingId: booking.bookingId,
                                title: schedule.productName,
                                startDate: schedule.startDate.slice(0, 10),
                                endDate: schedule.endDate.slice(0, 10),
                                status:
                                    startDate > today
                                        ? "upcoming"
                                        : "ongoing",
                            };
                        }
                    )
                );

                setTrips(
                    convertedTrips.filter(
                        (trip): trip is Trip => trip !== null
                    )
                );
            } catch (err) {
                console.log("체크리스트 여행 조회 실패:", err);
                setTrips([]);
            }
        };

        fetchTrips();
    }, [userId]);

    useEffect(() => {
        getChecklists(userId)
            .then(async (res) => {
                const data = await Promise.all(
                    res.data.map(async (checklist: Checklist) => {
                        const itemRes = await getChecklistItems(
                            checklist.checklistId
                        );

                        return {
                            ...checklist,
                            items: itemRes.data || [],
                        };
                    })
                );

                setChecklists(data);
            })
            .catch((err) => {
                console.log("체크리스트 조회 실패:", err);
            });
    }, [userId]);

    useEffect(() => {
        if (filteredTrips.length > 0) {
            setSelectedBookingId(filteredTrips[0].bookingId);
        } else {
            setSelectedBookingId(null);
        }
    }, [tripStatus, trips]);

    const filteredChecklists = checklists.filter(
        (checklist) => checklist.bookingId === selectedBookingId
    );

    const addChecklist = async () => {
        if (!selectedBookingId) {
            alert("먼저 여행을 선택해주세요.");
            return;
        }

        const title = prompt("체크리스트 제목을 입력해주세요.");
        if (!title || title.trim() === "") return;

        try {
            const res = await addChecklistApi({
                userId,
                bookingId: selectedBookingId,
                title,
            });

            setChecklists([
                ...checklists,
                {
                    ...res.data,
                    items: [],
                },
            ]);

            alert("체크리스트가 추가되었습니다.");
        } catch (err) {
            console.log("체크리스트 추가 실패:", err);
            alert("체크리스트 추가에 실패했습니다.");
        }
    };

    const editChecklist = async (checklistId: number, oldTitle: string) => {
        const newTitle = prompt("새 제목을 입력해주세요.", oldTitle);

        if (!newTitle || newTitle.trim() === "") return;

        try {
            const res = await updateChecklistApi(checklistId, {
                title: newTitle,
            });

            setChecklists(
                checklists.map((checklist) =>
                    checklist.checklistId === checklistId
                        ? {
                            ...checklist,
                            title: res.data.title,
                        }
                        : checklist
                )
            );

            alert("체크리스트 제목이 수정되었습니다.");
        } catch (err) {
            console.log("체크리스트 수정 실패:", err);
            alert("체크리스트 수정에 실패했습니다.");
        }
    };

    const deleteChecklist = async (checklistId: number) => {
        if (!confirm("이 체크리스트를 삭제하시겠습니까?")) return;

        try {
            await deleteChecklistApi(checklistId);

            setChecklists(
                checklists.filter(
                    (checklist) => checklist.checklistId !== checklistId
                )
            );

            alert("체크리스트가 삭제되었습니다.");
        } catch (err) {
            console.log("체크리스트 삭제 실패:", err);
            alert("체크리스트 삭제에 실패했습니다.");
        }
    };

    const toggleItem = async (checklistId: number, itemId: number) => {
        const checklist = checklists.find(
            (checklist) => checklist.checklistId === checklistId
        );

        const item = checklist?.items.find((item) => item.itemId === itemId);

        if (!item) return;

        // 현재 500이면 체크된 상태, 아니면 미체크
        const nextCheckedValue = item.isChecked === 500 ? 100 : 500;

        try {
            await updateChecklistItem(itemId, {
                itemName: item.itemName,
                isChecked: nextCheckedValue,
            });

            setChecklists(
                checklists.map((checklist) =>
                    checklist.checklistId === checklistId
                        ? {
                            ...checklist,
                            items: checklist.items.map((item) =>
                                item.itemId === itemId
                                    ? {
                                            ...item,
                                            isChecked: nextCheckedValue,
                                        }
                                    : item
                            ),
                        }
                        : checklist
                )
            );
        } catch (err) {
            console.log("체크 상태 수정 실패:", err);
            alert("체크 상태 수정에 실패했습니다.");
        }
    };

    const addItem = async (checklistId: number) => {
        const itemName = newItems[checklistId] || "";

        if (itemName.trim() === "") {
            alert("추가할 항목을 입력해주세요.");
            return;
        }

        try {
            const res = await addChecklistItem({
                checklistId,
                itemName,
                isChecked: 100,
            });

            setChecklists(
                checklists.map((checklist) =>
                    checklist.checklistId === checklistId
                        ? {
                            ...checklist,
                            items: [...checklist.items, res.data],
                        }
                        : checklist
                )
            );

            setNewItems({
                ...newItems,
                [checklistId]: "",
            });
        } catch (err) {
            console.log("항목 추가 실패:", err);
            alert("항목 추가에 실패했습니다.");
        }
    };

    const editItem = async (
        checklistId: number,
        itemId: number,
        oldName: string
    ) => {
        const newName = prompt("새 항목명을 입력해주세요.", oldName);
        if (!newName || newName.trim() === "") return;

        const checklist = checklists.find(
            (checklist) => checklist.checklistId === checklistId
        );

        const item = checklist?.items.find((item) => item.itemId === itemId);

        if (!item) return;

        try {
            await updateChecklistItem(itemId, {
                itemName: newName,
                isChecked: item.isChecked,
            });

            setChecklists(
                checklists.map((checklist) =>
                    checklist.checklistId === checklistId
                        ? {
                            ...checklist,
                            items: checklist.items.map((item) =>
                                item.itemId === itemId
                                    ? { ...item, itemName: newName }
                                    : item
                            ),
                        }
                        : checklist
                )
            );
        } catch (err) {
            console.log("항목 수정 실패:", err);
            alert("항목 수정에 실패했습니다.");
        }
    };

    const deleteItem = async (checklistId: number, itemId: number) => {
        if (!confirm("이 항목을 삭제하시겠습니까?")) return;

        try {
            await deleteChecklistItem(itemId);

            setChecklists(
                checklists.map((checklist) =>
                    checklist.checklistId === checklistId
                        ? {
                            ...checklist,
                            items: checklist.items.filter(
                                (item) => item.itemId !== itemId
                            ),
                        }
                        : checklist
                )
            );
        } catch (err) {
            console.log("항목 삭제 실패:", err);
            alert("항목 삭제에 실패했습니다.");
        }
    };

    return (
        <div className="border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-neutral-900">
                        여행 준비 체크리스트
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500">
                        예정 및 진행 중인 여행별로 준비물을 관리합니다.
                    </p>
                </div>

                <button
                    onClick={addChecklist}
                    disabled={!selectedBookingId}
                    className="border rounded px-4 py-2 hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                    + 체크리스트 추가
                </button>
            </div>

            <div className="flex gap-4 mb-5">
                <button
                    onClick={() => setTripStatus("upcoming")}
                    className={
                        tripStatus === "upcoming"
                            ? "px-6 py-2 rounded bg-blue-200 font-bold"
                            : "px-6 py-2 rounded bg-gray-100"
                    }
                >
                    예정인 여행
                </button>

                <button
                    onClick={() => setTripStatus("ongoing")}
                    className={
                        tripStatus === "ongoing"
                            ? "px-6 py-2 rounded bg-green-200 font-bold"
                            : "px-6 py-2 rounded bg-gray-100"
                    }
                >
                    진행 중인 여행
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredTrips.map((trip) => (
                    <button
                        key={trip.bookingId}
                        onClick={() => setSelectedBookingId(trip.bookingId)}
                        className={
                            selectedBookingId === trip.bookingId
                                ? "border-2 border-blue-400 rounded-lg p-4 text-left bg-blue-50"
                                : "border rounded-lg p-4 text-left bg-white hover:bg-gray-50"
                        }
                    >
                        <p className="font-bold">{trip.title}</p>
                        <p className="text-gray-500">
                            {trip.startDate} ~ {trip.endDate}
                        </p>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {filteredChecklists.map((checklist) => {
                    const completedCount = checklist.items.filter(
                        (item) => item.isChecked === 500
                    ).length;

                    return (
                        <section
                            key={checklist.checklistId}
                            className="border border-neutral-200 bg-neutral-50 p-5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-extrabold text-neutral-900">
                                    {checklist.title} ({completedCount}/
                                    {checklist.items.length})
                                </h3>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            editChecklist(
                                                checklist.checklistId,
                                                checklist.title
                                            )
                                        }
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        수정
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteChecklist(checklist.checklistId)
                                        }
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {checklist.items.map((item) => (
                                    <div
                                        key={item.itemId}
                                        className="flex items-center bg-white border rounded px-3 py-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={item.isChecked === 500}
                                            onChange={() =>
                                                toggleItem(
                                                    checklist.checklistId,
                                                    item.itemId
                                                )
                                            }
                                            className="mr-3"
                                        />

                                        <span
                                            className={
                                                item.isChecked === 500
                                                    ? "line-through text-gray-400"
                                                    : ""
                                            }
                                        >
                                            {item.itemName}
                                        </span>

                                        <div className="ml-auto flex gap-3">
                                            <button
                                                onClick={() =>
                                                    editItem(
                                                        checklist.checklistId,
                                                        item.itemId,
                                                        item.itemName
                                                    )
                                                }
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                수정
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteItem(
                                                        checklist.checklistId,
                                                        item.itemId
                                                    )
                                                }
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex mt-4 gap-2">
                                <input
                                    type="text"
                                    value={newItems[checklist.checklistId] || ""}
                                    onChange={(e) =>
                                        setNewItems({
                                            ...newItems,
                                            [checklist.checklistId]:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="새 항목 입력"
                                    className="flex-1 border rounded px-3 py-2"
                                />

                                <button
                                    onClick={() => addItem(checklist.checklistId)}
                                    className="border rounded px-4 py-2 hover:bg-blue-50"
                                >
                                    추가
                                </button>
                            </div>
                        </section>
                    );
                })}
            </div>

            {selectedBookingId && filteredChecklists.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    선택한 여행에 등록된 체크리스트가 없습니다.
                </div>
            )}
        </div>
    );
}

export default ChecklistPage;