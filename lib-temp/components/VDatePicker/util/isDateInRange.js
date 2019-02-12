function dateFromStr(strDate, deltaDay = 0, deltaMonth = 0, deltaYear = 0) {
    if (typeof strDate === 'string') {
        const yr = parseInt(strDate.substring(0, 4));
        const mon = parseInt(strDate.substring(5, 8));
        const dt = parseInt(strDate.substring(8, 10));
        const d = new Date(yr, mon - 1, dt);
        if (typeof d.setMonth === 'function') {
            d.setMonth(d.getMonth() + deltaMonth, d.getDate() + deltaDay);
            d.setFullYear(d.getFullYear() + deltaYear);
            return d;
        }
    }
    return null;
}
export default function isDateInRange(date, range) {
    const dateToCheck = dateFromStr(date);
    if (Array.isArray(range)) {
        if (typeof range[0] === 'string' && typeof range[1] === 'string') {
            const startDate = dateFromStr(range[0]);
            const endDate = dateFromStr(range[1]);
            return (startDate && endDate && dateToCheck)
                ? startDate.getTime() <= dateToCheck.getTime() && endDate.getTime() >= dateToCheck.getTime()
                : false;
        }
    }
    return false;
}
export function isHoverAfterStartDate(btnDate, startDate, hoveringDate) {
    const _me = dateFromStr(btnDate);
    const _std = dateFromStr(startDate);
    const _htd = dateFromStr(hoveringDate);
    return (_std && _htd && _me)
        ? _me.getTime() >= _std.getTime() && _me.getTime() <= _htd.getTime() && _std.getTime() < _htd.getTime()
        : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXNEYXRlSW5SYW5nZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZEYXRlUGlja2VyL3V0aWwvaXNEYXRlSW5SYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLFdBQVcsQ0FBRSxPQUFzQixFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQztJQUN2RixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUMvQixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM1QyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM3QyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUU3QyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVuQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDcEMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQTtZQUM3RCxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQTtZQUUxQyxPQUFPLENBQUMsQ0FBQTtTQUNUO0tBQ0Y7SUFFRCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsT0FBTyxVQUFVLGFBQWEsQ0FBRSxJQUFZLEVBQUUsS0FBVTtJQUM3RCxNQUFNLFdBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFckMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUNoRSxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDdkMsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRXJDLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxJQUFJLFdBQVcsQ0FBQztnQkFDMUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7Z0JBQzVGLENBQUMsQ0FBQyxLQUFLLENBQUE7U0FDVjtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUFFLE9BQWUsRUFBRSxTQUFjLEVBQUUsWUFBb0I7SUFDMUYsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2hDLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNuQyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUE7SUFFdEMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDdkcsQ0FBQyxDQUFDLEtBQUssQ0FBQTtBQUNYLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBkYXRlRnJvbVN0ciAoc3RyRGF0ZTogc3RyaW5nIHwgbnVsbCwgZGVsdGFEYXkgPSAwLCBkZWx0YU1vbnRoID0gMCwgZGVsdGFZZWFyID0gMCkge1xyXG4gIGlmICh0eXBlb2Ygc3RyRGF0ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgIGNvbnN0IHlyID0gcGFyc2VJbnQoc3RyRGF0ZS5zdWJzdHJpbmcoMCwgNCkpXHJcbiAgICBjb25zdCBtb24gPSBwYXJzZUludChzdHJEYXRlLnN1YnN0cmluZyg1LCA4KSlcclxuICAgIGNvbnN0IGR0ID0gcGFyc2VJbnQoc3RyRGF0ZS5zdWJzdHJpbmcoOCwgMTApKVxyXG5cclxuICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSh5ciwgbW9uIC0gMSwgZHQpXHJcblxyXG4gICAgaWYgKHR5cGVvZiBkLnNldE1vbnRoID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIGQuc2V0TW9udGgoZC5nZXRNb250aCgpICsgZGVsdGFNb250aCwgZC5nZXREYXRlKCkgKyBkZWx0YURheSlcclxuICAgICAgZC5zZXRGdWxsWWVhcihkLmdldEZ1bGxZZWFyKCkgKyBkZWx0YVllYXIpXHJcblxyXG4gICAgICByZXR1cm4gZFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG51bGxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNEYXRlSW5SYW5nZSAoZGF0ZTogc3RyaW5nLCByYW5nZTogYW55KTogYm9vbGVhbiB7XHJcbiAgY29uc3QgZGF0ZVRvQ2hlY2sgPSBkYXRlRnJvbVN0cihkYXRlKVxyXG5cclxuICBpZiAoQXJyYXkuaXNBcnJheShyYW5nZSkpIHtcclxuICAgIGlmICh0eXBlb2YgcmFuZ2VbMF0gPT09ICdzdHJpbmcnICYmIHR5cGVvZiByYW5nZVsxXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgY29uc3Qgc3RhcnREYXRlID0gZGF0ZUZyb21TdHIocmFuZ2VbMF0pXHJcbiAgICAgIGNvbnN0IGVuZERhdGUgPSBkYXRlRnJvbVN0cihyYW5nZVsxXSlcclxuXHJcbiAgICAgIHJldHVybiAoc3RhcnREYXRlICYmIGVuZERhdGUgJiYgZGF0ZVRvQ2hlY2spXHJcbiAgICAgICAgPyBzdGFydERhdGUuZ2V0VGltZSgpIDw9IGRhdGVUb0NoZWNrLmdldFRpbWUoKSAmJiBlbmREYXRlLmdldFRpbWUoKSA+PSBkYXRlVG9DaGVjay5nZXRUaW1lKClcclxuICAgICAgICA6IGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNIb3ZlckFmdGVyU3RhcnREYXRlIChidG5EYXRlOiBzdHJpbmcsIHN0YXJ0RGF0ZTogYW55LCBob3ZlcmluZ0RhdGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gIGNvbnN0IF9tZSA9IGRhdGVGcm9tU3RyKGJ0bkRhdGUpXHJcbiAgY29uc3QgX3N0ZCA9IGRhdGVGcm9tU3RyKHN0YXJ0RGF0ZSlcclxuICBjb25zdCBfaHRkID0gZGF0ZUZyb21TdHIoaG92ZXJpbmdEYXRlKVxyXG5cclxuICByZXR1cm4gKF9zdGQgJiYgX2h0ZCAmJiBfbWUpXHJcbiAgICA/IF9tZS5nZXRUaW1lKCkgPj0gX3N0ZC5nZXRUaW1lKCkgJiYgX21lLmdldFRpbWUoKSA8PSBfaHRkLmdldFRpbWUoKSAmJiBfc3RkLmdldFRpbWUoKSA8IF9odGQuZ2V0VGltZSgpXHJcbiAgICA6IGZhbHNlXHJcbn1cclxuIl19