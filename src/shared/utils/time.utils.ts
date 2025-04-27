export class TimeUtils {
  static parseDuration(duration: string): number {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1));

    switch (unit) {
      case 'h':
        return value * 60 * 60 * 1000; // hours to milliseconds
      case 'd':
        return value * 24 * 60 * 60 * 1000; // days to milliseconds
      case 'm':
        return value * 60 * 1000; // minutes to milliseconds
      case 's':
        return value * 1000; // seconds to milliseconds
      default:
        return value;
    }
  }
}
