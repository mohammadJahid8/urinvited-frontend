const statusCounts = (data: any) => {
  const counts = {
    all: data?.length,
    yes: data?.filter((guest: any) => guest.rsvpStatus === 'yes').length,
    no: data?.filter((guest: any) => guest.rsvpStatus === 'no').length,
    maybe: data?.filter((guest: any) => guest.rsvpStatus === 'maybe').length,
  };

  return counts;
};

export default statusCounts;
