export const formatDate = (
	dateValue?: string | null
) => {
	if (!dateValue) {
		return "-"
	}

	return dateValue.slice(0, 10)
}