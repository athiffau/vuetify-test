// Styles
// import '../../stylus/components/_calendar-daily.styl'
// Mixins
import CalendarBase from './mixins/calendar-base';
// Util
import props from './util/props';
import { DAYS_IN_MONTH_MAX, DAY_MIN, DAYS_IN_WEEK, parseTimestamp, relativeDays, nextDay, prevDay, copyTimestamp, updateFormatted, updateWeekday, updateRelative, getStartOfMonth, getEndOfMonth } from './util/timestamp';
// Calendars
import VCalendarMonthly from './VCalendarMonthly';
import VCalendarDaily from './VCalendarDaily';
import VCalendarWeekly from './VCalendarWeekly';
/* @vue/component */
export default CalendarBase.extend({
    name: 'v-calendar',
    props: {
        ...props.calendar,
        ...props.weeks,
        ...props.intervals
    },
    data: () => ({
        lastStart: null,
        lastEnd: null
    }),
    computed: {
        parsedValue() {
            return parseTimestamp(this.value) ||
                this.parsedStart ||
                this.times.today;
        },
        renderProps() {
            const around = this.parsedValue;
            let component = 'div';
            let maxDays = this.maxDays;
            let start = around;
            let end = around;
            switch (this.type) {
                case 'month':
                    component = VCalendarMonthly;
                    start = getStartOfMonth(around);
                    end = getEndOfMonth(around);
                    break;
                case 'week':
                    component = VCalendarDaily;
                    start = this.getStartOfWeek(around);
                    end = this.getEndOfWeek(around);
                    maxDays = 7;
                    break;
                case 'day':
                    component = VCalendarDaily;
                    maxDays = 1;
                    break;
                case '4day':
                    component = VCalendarDaily;
                    end = relativeDays(copyTimestamp(end), nextDay, 4);
                    updateFormatted(end);
                    maxDays = 4;
                    break;
                case 'custom-weekly':
                    component = VCalendarWeekly;
                    start = this.parsedStart || around;
                    end = this.parsedEnd;
                    break;
                case 'custom-daily':
                    component = VCalendarDaily;
                    start = this.parsedStart || around;
                    end = this.parsedEnd;
                    break;
            }
            return { component, start, end, maxDays };
        }
    },
    watch: {
        renderProps: 'checkChange'
    },
    methods: {
        checkChange() {
            const { start, end } = this.renderProps;
            if (start !== this.lastStart || end !== this.lastEnd) {
                this.lastStart = start;
                this.lastEnd = end;
                this.$emit('change', { start, end });
            }
        },
        move(amount = 1) {
            const moved = copyTimestamp(this.parsedValue);
            const forward = amount > 0;
            const mover = forward ? nextDay : prevDay;
            const limit = forward ? DAYS_IN_MONTH_MAX : DAY_MIN;
            let times = forward ? amount : -amount;
            while (--times >= 0) {
                switch (this.type) {
                    case 'month':
                        moved.day = limit;
                        mover(moved);
                        break;
                    case 'week':
                        relativeDays(moved, mover, DAYS_IN_WEEK);
                        break;
                    case 'day':
                        mover(moved);
                        break;
                    case '4day':
                        relativeDays(moved, mover, 4);
                        break;
                }
            }
            updateWeekday(moved);
            updateFormatted(moved);
            updateRelative(moved, this.times.now);
            this.$emit('input', moved.date);
            this.$emit('moved', moved);
        },
        next(amount = 1) {
            this.move(amount);
        },
        prev(amount = 1) {
            this.move(-amount);
        },
        timeToY(time, clamp = true) {
            const c = this.$children[0];
            if (c && c.timeToY) {
                return c.timeToY(time, clamp);
            }
            else {
                return false;
            }
        },
        minutesToPixels(minutes) {
            const c = this.$children[0];
            if (c && c.minutesToPixels) {
                return c.minutesToPixels(minutes);
            }
            else {
                return -1;
            }
        },
        scrollToTime(time) {
            const c = this.$children[0];
            if (c && c.scrollToTime) {
                return c.scrollToTime(time);
            }
            else {
                return false;
            }
        }
    },
    render(h) {
        const { start, end, maxDays, component } = this.renderProps;
        return h(component, {
            staticClass: 'v-calendar',
            props: {
                ...this.$props,
                start: start.date,
                end: end.date,
                maxDays
            },
            on: {
                ...this.$listeners,
                'click:date': (day) => {
                    if (this.$listeners['input']) {
                        this.$emit('input', day.date);
                    }
                    if (this.$listeners['click:date']) {
                        this.$emit('click:date', day);
                    }
                }
            },
            scopedSlots: this.$scopedSlots
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkNhbGVuZGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvVkNhbGVuZGFyL1ZDYWxlbmRhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1Qsd0RBQXdEO0FBS3hELFNBQVM7QUFDVCxPQUFPLFlBQVksTUFBTSx3QkFBd0IsQ0FBQTtBQUVqRCxPQUFPO0FBQ1AsT0FBTyxLQUFLLE1BQU0sY0FBYyxDQUFBO0FBQ2hDLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsT0FBTyxFQUNQLFlBQVksRUFHWixjQUFjLEVBQ2QsWUFBWSxFQUNaLE9BQU8sRUFDUCxPQUFPLEVBQ1AsYUFBYSxFQUNiLGVBQWUsRUFDZixhQUFhLEVBQ2IsY0FBYyxFQUNkLGVBQWUsRUFDZixhQUFhLEVBQ2QsTUFBTSxrQkFBa0IsQ0FBQTtBQUV6QixZQUFZO0FBQ1osT0FBTyxnQkFBZ0IsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLGNBQWMsTUFBTSxrQkFBa0IsQ0FBQTtBQUM3QyxPQUFPLGVBQWUsTUFBTSxtQkFBbUIsQ0FBQTtBQVUvQyxvQkFBb0I7QUFDcEIsZUFBZSxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQ2pDLElBQUksRUFBRSxZQUFZO0lBRWxCLEtBQUssRUFBRTtRQUNMLEdBQUcsS0FBSyxDQUFDLFFBQVE7UUFDakIsR0FBRyxLQUFLLENBQUMsS0FBSztRQUNkLEdBQUcsS0FBSyxDQUFDLFNBQVM7S0FDbkI7SUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNYLFNBQVMsRUFBRSxJQUF5QjtRQUNwQyxPQUFPLEVBQUUsSUFBeUI7S0FDbkMsQ0FBQztJQUVGLFFBQVEsRUFBRTtRQUNSLFdBQVc7WUFDVCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMvQixJQUFJLENBQUMsV0FBVztnQkFDaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUE7UUFDcEIs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QUFHLENBQUMsSUFBSTtnQkFDYixPQUFPO2FBQ1I7WUFDRCxFQUFFLEVBQUU7Z0JBQ0YsR0FBRyxJQUFJLENBQUMsVUFBVTtnQkFDbEIsWUFBWSxFQUFFLENBQUMsR0FBZSxFQUFFLEVBQUU7b0JBQ2hDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTt3QkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO3FCQUM5QjtvQkFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7d0JBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFBO3FCQUM5QjtnQkFDSCxDQUFDO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDL0IsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xyXG4vLyBpbXBvcnQgJy4uLy4uL3N0eWx1cy9jb21wb25lbnRzL19jYWxlbmRhci1kYWlseS5zdHlsJ1xyXG5cclxuLy8gVHlwZXNcclxuaW1wb3J0IHsgVk5vZGUsIENvbXBvbmVudCB9IGZyb20gJ3Z1ZSdcclxuXHJcbi8vIE1peGluc1xyXG5pbXBvcnQgQ2FsZW5kYXJCYXNlIGZyb20gJy4vbWl4aW5zL2NhbGVuZGFyLWJhc2UnXHJcblxyXG4vLyBVdGlsXHJcbmltcG9ydCBwcm9wcyBmcm9tICcuL3V0aWwvcHJvcHMnXHJcbmltcG9ydCB7XHJcbiAgREFZU19JTl9NT05USF9NQVgsXHJcbiAgREFZX01JTixcclxuICBEQVlTX0lOX1dFRUssXHJcbiAgVlRpbWVzdGFtcCxcclxuICBWVGltZSxcclxuICBwYXJzZVRpbWVzdGFtcCxcclxuICByZWxhdGl2ZURheXMsXHJcbiAgbmV4dERheSxcclxuICBwcmV2RGF5LFxyXG4gIGNvcHlUaW1lc3RhbXAsXHJcbiAgdXBkYXRlRm9ybWF0dGVkLFxyXG4gIHVwZGF0ZVdlZWtkYXksXHJcbiAgdXBkYXRlUmVsYXRpdmUsXHJcbiAgZ2V0U3RhcnRPZk1vbnRoLFxyXG4gIGdldEVuZE9mTW9udGhcclxufSBmcm9tICcuL3V0aWwvdGltZXN0YW1wJ1xyXG5cclxuLy8gQ2FsZW5kYXJzXHJcbmltcG9ydCBWQ2FsZW5kYXJNb250aGx5IGZyb20gJy4vVkNhbGVuZGFyTW9udGhseSdcclxuaW1wb3J0IFZDYWxlbmRhckRhaWx5IGZyb20gJy4vVkNhbGVuZGFyRGFpbHknXHJcbmltcG9ydCBWQ2FsZW5kYXJXZWVrbHkgZnJvbSAnLi9WQ2FsZW5kYXJXZWVrbHknXHJcblxyXG4vLyBUeXBlc1xyXG5pbnRlcmZhY2UgVkNhbGVuZGFyUmVuZGVyUHJvcHMge1xyXG4gIHN0YXJ0OiBWVGltZXN0YW1wXHJcbiAgZW5kOiBWVGltZXN0YW1wXHJcbiAgY29tcG9uZW50OiBzdHJpbmcgfCBDb21wb25lbnRcclxuICBtYXhEYXlzOiBudW1iZXJcclxufVxyXG5cclxuLyogQHZ1ZS9jb21wb25lbnQgKi9cclxuZXhwb3J0IGRlZmF1bHQgQ2FsZW5kYXJCYXNlLmV4dGVuZCh7XHJcbiAgbmFtZTogJ3YtY2FsZW5kYXInLFxyXG5cclxuICBwcm9wczoge1xyXG4gICAgLi4ucHJvcHMuY2FsZW5kYXIsXHJcbiAgICAuLi5wcm9wcy53ZWVrcyxcclxuICAgIC4uLnByb3BzLmludGVydmFsc1xyXG4gIH0sXHJcblxyXG4gIGRhdGE6ICgpID0+ICh7XHJcbiAgICBsYXN0U3RhcnQ6IG51bGwgYXMgVlRpbWVzdGFtcCB8IG51bGwsXHJcbiAgICBsYXN0RW5kOiBudWxsIGFzIFZUaW1lc3RhbXAgfCBudWxsXHJcbiAgfSksXHJcblxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICBwYXJzZWRWYWx1ZSAoKTogVlRpbWVzdGFtcCB7XHJcbiAgICAgIHJldHVybiBwYXJzZVRpbWVzdGFtcCh0aGlzLnZhbHVlKSB8fFxyXG4gICAgICAgIHRoaXMucGFyc2VkU3RhcnQgfHxcclxuICAgICAgICB0aGlzLnRpbWVzLnRvZGF5XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyUHJvcHMgKCk6IFZDYWxlbmRhclJlbmRlclByb3BzIHtcclxuICAgICAgY29uc3QgYXJvdW5kID0gdGhpcy5wYXJzZWRWYWx1ZVxyXG4gICAgICBsZXQgY29tcG9uZW50OiBhbnkgPSAnZGl2J1xyXG4gICAgICBsZXQgbWF4RGF5cyA9IHRoaXMubWF4RGF5c1xyXG4gICAgICBsZXQgc3RhcnQgPSBhcm91bmRcclxuICAgICAgbGV0IGVuZCA9IGFyb3VuZFxyXG4gICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ21vbnRoJzpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhck1vbnRobHlcclxuICAgICAgICAgIHN0YXJ0ID0gZ2V0U3RhcnRPZk1vbnRoKGFyb3VuZClcclxuICAgICAgICAgIGVuZCA9IGdldEVuZE9mTW9udGgoYXJvdW5kKVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICd3ZWVrJzpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhckRhaWx5XHJcbiAgICAgICAgICBzdGFydCA9IHRoaXMuZ2V0U3RhcnRPZldlZWsoYXJvdW5kKVxyXG4gICAgICAgICAgZW5kID0gdGhpcy5nZXRFbmRPZldlZWsoYXJvdW5kKVxyXG4gICAgICAgICAgbWF4RGF5cyA9IDdcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAnZGF5JzpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhckRhaWx5XHJcbiAgICAgICAgICBtYXhEYXlzID0gMVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICc0ZGF5JzpcclxuICAgICAgICAgIGNvbXBvbmVudCA9IFZDYWxlbmRhckRhaWx5XHJcbiAgICAgICAgICBlbmQgPSByZWxhdGl2ZURheXMoY29weVRpbWVzdGFtcChlbmQpLCBuZXh0RGF5LCA0KVxyXG4gICAgICAgICAgdXBkYXRlRm9ybWF0dGVkKGVuZClcclxuICAgICAgICAgIG1heERheXMgPSA0XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2N1c3RvbS13ZWVrbHknOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyV2Vla2x5XHJcbiAgICAgICAgICBzdGFydCA9IHRoaXMucGFyc2VkU3RhcnQgfHwgYXJvdW5kXHJcbiAgICAgICAgICBlbmQgPSB0aGlzLnBhcnNlZEVuZFxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICdjdXN0b20tZGFpbHknOlxyXG4gICAgICAgICAgY29tcG9uZW50ID0gVkNhbGVuZGFyRGFpbHlcclxuICAgICAgICAgIHN0YXJ0ID0gdGhpcy5wYXJzZWRTdGFydCB8fCBhcm91bmRcclxuICAgICAgICAgIGVuZCA9IHRoaXMucGFyc2VkRW5kXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4geyBjb21wb25lbnQsIHN0YXJ0LCBlbmQsIG1heERheXMgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICByZW5kZXJQcm9wczogJ2NoZWNrQ2hhbmdlJ1xyXG4gIH0sXHJcblxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGNoZWNrQ2hhbmdlICgpOiB2b2lkIHtcclxuICAgICAgY29uc3QgeyBzdGFydCwgZW5kIH0gPSB0aGlzLnJlbmRlclByb3BzXHJcbiAgICAgIGlmIChzdGFydCAhPT0gdGhpcy5sYXN0U3RhcnQgfHwgZW5kICE9PSB0aGlzLmxhc3RFbmQpIHtcclxuICAgICAgICB0aGlzLmxhc3RTdGFydCA9IHN0YXJ0XHJcbiAgICAgICAgdGhpcy5sYXN0RW5kID0gZW5kXHJcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgeyBzdGFydCwgZW5kIH0pXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtb3ZlIChhbW91bnQgPSAxKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IG1vdmVkID0gY29weVRpbWVzdGFtcCh0aGlzLnBhcnNlZFZhbHVlKVxyXG4gICAgICBjb25zdCBmb3J3YXJkID0gYW1vdW50ID4gMFxyXG4gICAgICBjb25zdCBtb3ZlciA9IGZvcndhcmQgPyBuZXh0RGF5IDogcHJldkRheVxyXG4gICAgICBjb25zdCBsaW1pdCA9IGZvcndhcmQgPyBEQVlTX0lOX01PTlRIX01BWCA6IERBWV9NSU5cclxuICAgICAgbGV0IHRpbWVzID0gZm9yd2FyZCA/IGFtb3VudCA6IC1hbW91bnRcclxuXHJcbiAgICAgIHdoaWxlICgtLXRpbWVzID49IDApIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAnbW9udGgnOlxyXG4gICAgICAgICAgICBtb3ZlZC5kYXkgPSBsaW1pdFxyXG4gICAgICAgICAgICBtb3Zlcihtb3ZlZClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgJ3dlZWsnOlxyXG4gICAgICAgICAgICByZWxhdGl2ZURheXMobW92ZWQsIG1vdmVyLCBEQVlTX0lOX1dFRUspXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlICdkYXknOlxyXG4gICAgICAgICAgICBtb3Zlcihtb3ZlZClcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgJzRkYXknOlxyXG4gICAgICAgICAgICByZWxhdGl2ZURheXMobW92ZWQsIG1vdmVyLCA0KVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdXBkYXRlV2Vla2RheShtb3ZlZClcclxuICAgICAgdXBkYXRlRm9ybWF0dGVkKG1vdmVkKVxyXG4gICAgICB1cGRhdGVSZWxhdGl2ZShtb3ZlZCwgdGhpcy50aW1lcy5ub3cpXHJcblxyXG4gICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIG1vdmVkLmRhdGUpXHJcbiAgICAgIHRoaXMuJGVtaXQoJ21vdmVkJywgbW92ZWQpXHJcbiAgICB9LFxyXG4gICAgbmV4dCAoYW1vdW50ID0gMSk6IHZvaWQge1xyXG4gICAgICB0aGlzLm1vdmUoYW1vdW50KVxyXG4gICAgfSxcclxuICAgIHByZXYgKGFtb3VudCA9IDEpOiB2b2lkIHtcclxuICAgICAgdGhpcy5tb3ZlKC1hbW91bnQpXHJcbiAgICB9LFxyXG4gICAgdGltZVRvWSAodGltZTogVlRpbWUsIGNsYW1wID0gdHJ1ZSk6IG51bWJlciB8IGZhbHNlIHtcclxuICAgICAgY29uc3QgYyA9IHRoaXMuJGNoaWxkcmVuWzBdIGFzIGFueVxyXG4gICAgICBpZiAoYyAmJiBjLnRpbWVUb1kpIHtcclxuICAgICAgICByZXR1cm4gYy50aW1lVG9ZKHRpbWUsIGNsYW1wKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbWludXRlc1RvUGl4ZWxzIChtaW51dGVzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICBjb25zdCBjID0gdGhpcy4kY2hpbGRyZW5bMF0gYXMgYW55XHJcbiAgICAgIGlmIChjICYmIGMubWludXRlc1RvUGl4ZWxzKSB7XHJcbiAgICAgICAgcmV0dXJuIGMubWludXRlc1RvUGl4ZWxzKG1pbnV0ZXMpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIC0xXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzY3JvbGxUb1RpbWUgKHRpbWU6IFZUaW1lKTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IGMgPSB0aGlzLiRjaGlsZHJlblswXSBhcyBhbnlcclxuICAgICAgaWYgKGMgJiYgYy5zY3JvbGxUb1RpbWUpIHtcclxuICAgICAgICByZXR1cm4gYy5zY3JvbGxUb1RpbWUodGltZSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHJlbmRlciAoaCk6IFZOb2RlIHtcclxuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCwgbWF4RGF5cywgY29tcG9uZW50IH0gPSB0aGlzLnJlbmRlclByb3BzXHJcblxyXG4gICAgcmV0dXJuIGgoY29tcG9uZW50LCB7XHJcbiAgICAgIHN0YXRpY0NsYXNzOiAndi1jYWxlbmRhcicsXHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgLi4udGhpcy4kcHJvcHMsXHJcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LmRhdGUsXHJcbiAgICAgICAgZW5kOiBlbmQuZGF0ZSxcclxuICAgICAgICBtYXhEYXlzXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiB7XHJcbiAgICAgICAgLi4udGhpcy4kbGlzdGVuZXJzLFxyXG4gICAgICAgICdjbGljazpkYXRlJzogKGRheTogVlRpbWVzdGFtcCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuJGxpc3RlbmVyc1snaW5wdXQnXSkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KCdpbnB1dCcsIGRheS5kYXRlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHRoaXMuJGxpc3RlbmVyc1snY2xpY2s6ZGF0ZSddKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVtaXQoJ2NsaWNrOmRhdGUnLCBkYXkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzY29wZWRTbG90czogdGhpcy4kc2NvcGVkU2xvdHNcclxuICAgIH0pXHJcbiAgfVxyXG59KVxyXG4iXX0=