export class Response {
  constructor(status, message, data, refrence, error) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.refrence = refrence;
    this.error = error;
  }
}

export class GenerateDateForSupervisor {
  constructor() {
    this.today = new Date();

    const makeDateAtMidnight = (daysAgo = 0) => {
      const d = new Date(this.today);
      d.setHours(0, 0, 0, 0);
      d.setDate(this.today.getDate() - daysAgo);
      return d;
    };

    this.day0 = makeDateAtMidnight(0);
    this.day1ago = makeDateAtMidnight(1);
    this.day2ago = makeDateAtMidnight(2);
    this.day3ago = makeDateAtMidnight(3);
    this.day4ago = makeDateAtMidnight(4);
    this.day5ago = makeDateAtMidnight(5);
    this.day6ago = makeDateAtMidnight(6);
    this.day7ago = makeDateAtMidnight(7);
  }
}
