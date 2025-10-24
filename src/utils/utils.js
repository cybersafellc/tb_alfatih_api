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

    this.day1ago = new Date(this.today);
    this.day1ago.setDate(this.today.getDate() - 1);

    this.day2ago = new Date(this.today);
    this.day2ago.setDate(this.today.getDate() - 2);

    this.day3ago = new Date(this.today);
    this.day3ago.setDate(this.today.getDate() - 3);

    this.day4ago = new Date(this.today);
    this.day4ago.setDate(this.today.getDate() - 4);

    this.day5ago = new Date(this.today);
    this.day5ago.setDate(this.today.getDate() - 5);

    this.day6ago = new Date(this.today);
    this.day6ago.setDate(this.today.getDate() - 6);

    this.day7ago = new Date(this.today);
    this.day7ago.setDate(this.today.getDate() - 7);
  }
}
