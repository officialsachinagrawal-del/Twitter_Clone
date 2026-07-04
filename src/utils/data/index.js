export const formatMemberSinceDate = (createAt) =>{
    const date = new Date(createAt);

    const months = [
        "January",
        "February",
        "March",
        "April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",

    ];
    // const date = createAt();
    const month = months[Date.getMonth()];
    const year = Date.getFullYear();
    return `Joined ${date} ${month} ${year}`;
}