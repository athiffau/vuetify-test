import Vue from 'vue';
export function createSimpleFunctional(c, el = 'div', name) {
    return Vue.extend({
        name: name || c.replace(/__/g, '-'),
        functional: true,
        render(h, { data, children }) {
            data.staticClass = (`${c} ${data.staticClass || ''}`).trim();
            return h(el, data, children);
        }
    });
}
function mergeTransitions(transitions, array) {
    if (Array.isArray(transitions))
        return transitions.concat(array);
    if (transitions)
        array.push(transitions);
    return array;
}
export function createSimpleTransition(name, origin = 'top center 0', mode) {
    return {
        name,
        functional: true,
        props: {
            group: {
                type: Boolean,
                default: false
            },
            hideOnLeave: {
                type: Boolean,
                default: false
            },
            leaveAbsolute: {
                type: Boolean,
                default: false
            },
            mode: {
                type: String,
                default: mode
            },
            origin: {
                type: String,
                default: origin
            }
        },
        render(h, context) {
            const tag = `transition${context.props.group ? '-group' : ''}`;
            context.data = context.data || {};
            context.data.props = {
                name,
                mode: context.props.mode
            };
            context.data.on = context.data.on || {};
            if (!Object.isExtensible(context.data.on)) {
                context.data.on = { ...context.data.on };
            }
            const ourBeforeEnter = [];
            const ourLeave = [];
            const absolute = (el) => (el.style.position = 'absolute');
            ourBeforeEnter.push((el) => {
                el.style.transformOrigin = context.props.origin;
                el.style.webkitTransformOrigin = context.props.origin;
            });
            if (context.props.leaveAbsolute)
                ourLeave.push(absolute);
            if (context.props.hideOnLeave) {
                ourLeave.push((el) => (el.style.display = 'none'));
            }
            const { beforeEnter, leave } = context.data.on;
            // Type says Function | Function[] but
            // will only work if provided a function
            context.data.on.beforeEnter = () => mergeTransitions(beforeEnter, ourBeforeEnter);
            context.data.on.leave = mergeTransitions(leave, ourLeave);
            return h(tag, context.data, context.children);
        }
    };
}
export function createJavaScriptTransition(name, functions, mode = 'in-out') {
    return {
        name,
        functional: true,
        props: {
            mode: {
                type: String,
                default: mode
            }
        },
        render(h, context) {
            const data = {
                props: {
                    ...context.props,
                    name
                },
                on: functions
            };
            return h('transition', data, context.children);
        }
    };
}
export function directiveConfig(binding, defaults = {}) {
    return {
        ...defaults,
        ...binding.modifiers,
        value: binding.arg,
        ...(binding.value || {})
    };
}
export function addOnceEventListener(el, event, cb) {
    var once = () => {
        cb();
        el.removeEventListener(event, once, false);
    };
    el.addEventListener(event, once, false);
}
export function getNestedValue(obj, path, fallback) {
    const last = path.length - 1;
    if (last < 0)
        return obj === undefined ? fallback : obj;
    for (let i = 0; i < last; i++) {
        if (obj == null) {
            return fallback;
        }
        obj = obj[path[i]];
    }
    if (obj == null)
        return fallback;
    return obj[path[last]] === undefined ? fallback : obj[path[last]];
}
export function deepEqual(a, b) {
    if (a === b)
        return true;
    if (a instanceof Date && b instanceof Date) {
        // If the values are Date, they were convert to timestamp with getTime and compare it
        if (a.getTime() !== b.getTime())
            return false;
    }
    if (a !== Object(a) || b !== Object(b)) {
        // If the values aren't objects, they were already checked for equality
        return false;
    }
    const props = Object.keys(a);
    if (props.length !== Object.keys(b).length) {
        // Different number of props, don't bother to check
        return false;
    }
    return props.every(p => deepEqual(a[p], b[p]));
}
export function getObjectValueByPath(obj, path, fallback) {
    // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
    if (!path || path.constructor !== String)
        return fallback;
    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, ''); // strip a leading dot
    return getNestedValue(obj, path.split('.'), fallback);
}
export function getPropertyFromItem(item, property, fallback) {
    if (property == null)
        return item === undefined ? fallback : item;
    if (item !== Object(item))
        return fallback === undefined ? item : fallback;
    if (typeof property === 'string')
        return getObjectValueByPath(item, property, fallback);
    if (Array.isArray(property))
        return getNestedValue(item, property, fallback);
    if (typeof property !== 'function')
        return fallback;
    const value = property(item, fallback);
    return typeof value === 'undefined' ? fallback : value;
}
export function createRange(length) {
    return Array.from({ length }, (v, k) => k);
}
export function getZIndex(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE)
        return 0;
    const index = +window.getComputedStyle(el).getPropertyValue('z-index');
    if (isNaN(index))
        return getZIndex(el.parentNode);
    return index;
}
const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
export function escapeHTML(str) {
    return str.replace(/[&<>]/g, tag => tagsToReplace[tag] || tag);
}
export function filterObjectOnKeys(obj, keys) {
    const filtered = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof obj[key] !== 'undefined') {
            filtered[key] = obj[key];
        }
    }
    return filtered;
}
export function filterChildren(array = [], tag) {
    return array.filter(child => {
        return child.componentOptions &&
            child.componentOptions.Ctor.options.name === tag;
    });
}
export function convertToUnit(str, unit = 'px') {
    if (str == null || str === '') {
        return undefined;
    }
    else if (isNaN(+str)) {
        return String(str);
    }
    else {
        return `${Number(str)}${unit}`;
    }
}
export function kebabCase(str) {
    return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
export function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}
// KeyboardEvent.keyCode aliases
export const keyCodes = Object.freeze({
    enter: 13,
    tab: 9,
    delete: 46,
    esc: 27,
    space: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    end: 35,
    home: 36,
    del: 46,
    backspace: 8,
    insert: 45,
    pageup: 33,
    pagedown: 34
});
const ICONS_PREFIX = '$vuetify.icons.';
// This remaps internal names like '$vuetify.icons.cancel'
// to the current name or component for that icon.
export function remapInternalIcon(vm, iconName) {
    if (!iconName.startsWith(ICONS_PREFIX)) {
        return iconName;
    }
    // Now look up icon indirection name, e.g. '$vuetify.icons.cancel'
    return getObjectValueByPath(vm, iconName, iconName);
}
export function keys(o) {
    return Object.keys(o);
}
/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g;
export const camelize = (str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
};
/**
 * Returns the set difference of B and A, i.e. the set of elements in B but not in A
 */
export function arrayDiff(a, b) {
    const diff = [];
    for (let i = 0; i < b.length; i++) {
        if (a.indexOf(b[i]) < 0)
            diff.push(b[i]);
    }
    return diff;
}
/**
 * Makes the first character of a string uppercase
 */
export function upperFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Returns:
 *  - 'normal' for old style slots - `<template slot="default">`
 *  - 'scoped' for old style scoped slots (`<template slot="default" slot-scope="data">`) or bound v-slot (`#default="data"`)
 *  - 'v-slot' for unbound v-slot (`#default`) - only if the third param is true, otherwise counts as scoped
 */
export function getSlotType(vm, name, split) {
    if (vm.$slots[name] && vm.$scopedSlots[name] && vm.$scopedSlots[name].name) {
        return split ? 'v-slot' : 'scoped';
    }
    if (vm.$slots[name])
        return 'normal';
    if (vm.$scopedSlots[name])
        return 'scoped';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBSXJCLE1BQU0sVUFBVSxzQkFBc0IsQ0FDcEMsQ0FBUyxFQUNULEVBQUUsR0FBRyxLQUFLLEVBQ1YsSUFBYTtJQUViLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQixJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztRQUVuQyxVQUFVLEVBQUUsSUFBSTtRQUVoQixNQUFNLENBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO1lBRTVELE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDOUIsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUN2QixXQUE4QyxFQUM5QyxLQUFpQjtJQUVqQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQUUsT0FBTyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2hFLElBQUksV0FBVztRQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDeEMsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsTUFBTSxVQUFVLHNCQUFzQixDQUNwQyxJQUFZLEVBQ1osTUFBTSxHQUFHLGNBQWMsRUFDdkIsSUFBYTtJQUViLE9BQU87UUFDTCxJQUFJO1FBRUosVUFBVSxFQUFFLElBQUk7UUFFaEIsS0FBSyxFQUFF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QyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNuRCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUE2QixFQUFPLEVBQUUsSUFBWSxFQUFFLEtBQVM7SUFDdEYsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUssRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQVMsQ0FBQyxJQUFJLEVBQUU7UUFDbkYsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQWUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFBO0tBQzFDO0lBQ0QsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUFFLE9BQU8sUUFBUSxDQUFBO0lBQ3BDLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7UUFBRSxPQUFPLFFBQVEsQ0FBQTtBQUM1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXHJcbmltcG9ydCB7IFZOb2RlLCBWTm9kZURpcmVjdGl2ZSwgRnVuY3Rpb25hbENvbXBvbmVudE9wdGlvbnMgfSBmcm9tICd2dWUvdHlwZXMnXHJcbmltcG9ydCB7IFZ1ZXRpZnlJY29uIH0gZnJvbSAndnVldGlmeSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaW1wbGVGdW5jdGlvbmFsIChcclxuICBjOiBzdHJpbmcsXHJcbiAgZWwgPSAnZGl2JyxcclxuICBuYW1lPzogc3RyaW5nXHJcbikge1xyXG4gIHJldHVybiBWdWUuZXh0ZW5kKHtcclxuICAgIG5hbWU6IG5hbWUgfHwgYy5yZXBsYWNlKC9fXy9nLCAnLScpLFxyXG5cclxuICAgIGZ1bmN0aW9uYWw6IHRydWUsXHJcblxyXG4gICAgcmVuZGVyIChoLCB7IGRhdGEsIGNoaWxkcmVuIH0pOiBWTm9kZSB7XHJcbiAgICAgIGRhdGEuc3RhdGljQ2xhc3MgPSAoYCR7Y30gJHtkYXRhLnN0YXRpY0NsYXNzIHx8ICcnfWApLnRyaW0oKVxyXG5cclxuICAgICAgcmV0dXJuIGgoZWwsIGRhdGEsIGNoaWxkcmVuKVxyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lcmdlVHJhbnNpdGlvbnMgKFxyXG4gIHRyYW5zaXRpb25zOiB1bmRlZmluZWQgfCBGdW5jdGlvbiB8IEZ1bmN0aW9uW10sXHJcbiAgYXJyYXk6IEZ1bmN0aW9uW11cclxuKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkodHJhbnNpdGlvbnMpKSByZXR1cm4gdHJhbnNpdGlvbnMuY29uY2F0KGFycmF5KVxyXG4gIGlmICh0cmFuc2l0aW9ucykgYXJyYXkucHVzaCh0cmFuc2l0aW9ucylcclxuICByZXR1cm4gYXJyYXlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNpbXBsZVRyYW5zaXRpb24gKFxyXG4gIG5hbWU6IHN0cmluZyxcclxuICBvcmlnaW4gPSAndG9wIGNlbnRlciAwJyxcclxuICBtb2RlPzogc3RyaW5nXHJcbik6IEZ1bmN0aW9uYWxDb21wb25lbnRPcHRpb25zIHtcclxuICByZXR1cm4ge1xyXG4gICAgbmFtZSxcclxuXHJcbiAgICBmdW5jdGlvbmFsOiB0cnVlLFxyXG5cclxuICAgIHByb3BzOiB7XHJcbiAgICAgIGdyb3VwOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBoaWRlT25MZWF2ZToge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgbGVhdmVBYnNvbHV0ZToge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgbW9kZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBkZWZhdWx0OiBtb2RlXHJcbiAgICAgIH0sXHJcbiAgICAgIG9yaWdpbjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBkZWZhdWx0OiBvcmlnaW5cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXIgKGgsIGNvbnRleHQpOiBWTm9kZSB7XHJcbiAgICAgIGNvbnN0IHRhZyA9IGB0cmFuc2l0aW9uJHtjb250ZXh0LnByb3BzLmdyb3VwID8gJy1ncm91cCcgOiAnJ31gXHJcbiAgICAgIGNvbnRleHQuZGF0YSA9IGNvbnRleHQuZGF0YSB8fCB7fVxyXG4gICAgICBjb250ZXh0LmRhdGEucHJvcHMgPSB7XHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBtb2RlOiBjb250ZXh0LnByb3BzLm1vZGVcclxuICAgICAgfVxyXG4gICAgICBjb250ZXh0LmRhdGEub24gPSBjb250ZXh0LmRhdGEub24gfHwge31cclxuICAgICAgaWYgKCFPYmplY3QuaXNFeHRlbnNpYmxlKGNvbnRleHQuZGF0YS5vbikpIHtcclxuICAgICAgICBjb250ZXh0LmRhdGEub24gPSB7IC4uLmNvbnRleHQuZGF0YS5vbiB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG91ckJlZm9yZUVudGVyOiBGdW5jdGlvbltdID0gW11cclxuICAgICAgY29uc3Qgb3VyTGVhdmU6IEZ1bmN0aW9uW10gPSBbXVxyXG4gICAgICBjb25zdCBhYnNvbHV0ZSA9IChlbDogSFRNTEVsZW1lbnQpID0+IChlbC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZScpXHJcblxyXG4gICAgICBvdXJCZWZvcmVFbnRlci5wdXNoKChlbDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICBlbC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBjb250ZXh0LnByb3BzLm9yaWdpblxyXG4gICAgICAgIGVsLnN0eWxlLndlYmtpdFRyYW5zZm9ybU9yaWdpbiA9IGNvbnRleHQucHJvcHMub3JpZ2luXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBpZiAoY29udGV4dC5wcm9wcy5sZWF2ZUFic29sdXRlKSBvdXJMZWF2ZS5wdXNoKGFic29sdXRlKVxyXG4gICAgICBpZiAoY29udGV4dC5wcm9wcy5oaWRlT25MZWF2ZSkge1xyXG4gICAgICAgIG91ckxlYXZlLnB1c2goKGVsOiBIVE1MRWxlbWVudCkgPT4gKGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZScpKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB7IGJlZm9yZUVudGVyLCBsZWF2ZSB9ID0gY29udGV4dC5kYXRhLm9uXHJcblxyXG4gICAgICAvLyBUeXBlIHNheXMgRnVuY3Rpb24gfCBGdW5jdGlvbltdIGJ1dFxyXG4gICAgICAvLyB3aWxsIG9ubHkgd29yayBpZiBwcm92aWRlZCBhIGZ1bmN0aW9uXHJcbiAgICAgIGNvbnRleHQuZGF0YS5vbi5iZWZvcmVFbnRlciA9ICgpID0+IG1lcmdlVHJhbnNpdGlvbnMoYmVmb3JlRW50ZXIsIG91ckJlZm9yZUVudGVyKVxyXG4gICAgICBjb250ZXh0LmRhdGEub24ubGVhdmUgPSBtZXJnZVRyYW5zaXRpb25zKGxlYXZlLCBvdXJMZWF2ZSlcclxuXHJcbiAgICAgIHJldHVybiBoKHRhZywgY29udGV4dC5kYXRhLCBjb250ZXh0LmNoaWxkcmVuKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUphdmFTY3JpcHRUcmFuc2l0aW9uIChcclxuICBuYW1lOiBzdHJpbmcsXHJcbiAgZnVuY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCAoKSA9PiBhbnk+LFxyXG4gIG1vZGUgPSAnaW4tb3V0J1xyXG4pOiBGdW5jdGlvbmFsQ29tcG9uZW50T3B0aW9ucyB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWUsXHJcblxyXG4gICAgZnVuY3Rpb25hbDogdHJ1ZSxcclxuXHJcbiAgICBwcm9wczoge1xyXG4gICAgICBtb2RlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGRlZmF1bHQ6IG1vZGVcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXIgKGgsIGNvbnRleHQpOiBWTm9kZSB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgIC4uLmNvbnRleHQucHJvcHMsXHJcbiAgICAgICAgICBuYW1lXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZnVuY3Rpb25zXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBoKCd0cmFuc2l0aW9uJywgZGF0YSwgY29udGV4dC5jaGlsZHJlbilcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEJpbmRpbmdDb25maWcgPSBQaWNrPFZOb2RlRGlyZWN0aXZlLCAnYXJnJyB8ICdtb2RpZmllcnMnIHwgJ3ZhbHVlJz5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpcmVjdGl2ZUNvbmZpZyAoYmluZGluZzogQmluZGluZ0NvbmZpZywgZGVmYXVsdHMgPSB7fSk6IFZOb2RlRGlyZWN0aXZlIHtcclxuICByZXR1cm4ge1xyXG4gICAgLi4uZGVmYXVsdHMsXHJcbiAgICAuLi5iaW5kaW5nLm1vZGlmaWVycyxcclxuICAgIHZhbHVlOiBiaW5kaW5nLmFyZyxcclxuICAgIC4uLihiaW5kaW5nLnZhbHVlIHx8IHt9KVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZE9uY2VFdmVudExpc3RlbmVyIChlbDogRXZlbnRUYXJnZXQsIGV2ZW50OiBzdHJpbmcsIGNiOiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgdmFyIG9uY2UgPSAoKSA9PiB7XHJcbiAgICBjYigpXHJcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBvbmNlLCBmYWxzZSlcclxuICB9XHJcblxyXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIG9uY2UsIGZhbHNlKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmVzdGVkVmFsdWUgKG9iajogYW55LCBwYXRoOiAoc3RyaW5nIHwgbnVtYmVyKVtdLCBmYWxsYmFjaz86IGFueSk6IGFueSB7XHJcbiAgY29uc3QgbGFzdCA9IHBhdGgubGVuZ3RoIC0gMVxyXG5cclxuICBpZiAobGFzdCA8IDApIHJldHVybiBvYmogPT09IHVuZGVmaW5lZCA/IGZhbGxiYWNrIDogb2JqXHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdDsgaSsrKSB7XHJcbiAgICBpZiAob2JqID09IG51bGwpIHtcclxuICAgICAgcmV0dXJuIGZhbGxiYWNrXHJcbiAgICB9XHJcbiAgICBvYmogPSBvYmpbcGF0aFtpXV1cclxuICB9XHJcblxyXG4gIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbGxiYWNrXHJcblxyXG4gIHJldHVybiBvYmpbcGF0aFtsYXN0XV0gPT09IHVuZGVmaW5lZCA/IGZhbGxiYWNrIDogb2JqW3BhdGhbbGFzdF1dXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWVwRXF1YWwgKGE6IGFueSwgYjogYW55KTogYm9vbGVhbiB7XHJcbiAgaWYgKGEgPT09IGIpIHJldHVybiB0cnVlXHJcblxyXG4gIGlmIChhIGluc3RhbmNlb2YgRGF0ZSAmJiBiIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgLy8gSWYgdGhlIHZhbHVlcyBhcmUgRGF0ZSwgdGhleSB3ZXJlIGNvbnZlcnQgdG8gdGltZXN0YW1wIHdpdGggZ2V0VGltZSBhbmQgY29tcGFyZSBpdFxyXG4gICAgaWYgKGEuZ2V0VGltZSgpICE9PSBiLmdldFRpbWUoKSkgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICBpZiAoYSAhPT0gT2JqZWN0KGEpIHx8IGIgIT09IE9iamVjdChiKSkge1xyXG4gICAgLy8gSWYgdGhlIHZhbHVlcyBhcmVuJ3Qgb2JqZWN0cywgdGhleSB3ZXJlIGFscmVhZHkgY2hlY2tlZCBmb3IgZXF1YWxpdHlcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhKVxyXG5cclxuICBpZiAocHJvcHMubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhiKS5sZW5ndGgpIHtcclxuICAgIC8vIERpZmZlcmVudCBudW1iZXIgb2YgcHJvcHMsIGRvbid0IGJvdGhlciB0byBjaGVja1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG5cclxuICByZXR1cm4gcHJvcHMuZXZlcnkocCA9PiBkZWVwRXF1YWwoYVtwXSwgYltwXSkpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRPYmplY3RWYWx1ZUJ5UGF0aCAob2JqOiBvYmplY3QsIHBhdGg6IHN0cmluZywgZmFsbGJhY2s/OiBhbnkpOiBhbnkge1xyXG4gIC8vIGNyZWRpdDogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NDkxNDYzL2FjY2Vzc2luZy1uZXN0ZWQtamF2YXNjcmlwdC1vYmplY3RzLXdpdGgtc3RyaW5nLWtleSNjb21tZW50NTUyNzg0MTNfNjQ5MTYyMVxyXG4gIGlmICghcGF0aCB8fCBwYXRoLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcpIHJldHVybiBmYWxsYmFja1xyXG4gIHBhdGggPSBwYXRoLnJlcGxhY2UoL1xcWyhcXHcrKVxcXS9nLCAnLiQxJykgLy8gY29udmVydCBpbmRleGVzIHRvIHByb3BlcnRpZXNcclxuICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwuLywgJycpIC8vIHN0cmlwIGEgbGVhZGluZyBkb3RcclxuICByZXR1cm4gZ2V0TmVzdGVkVmFsdWUob2JqLCBwYXRoLnNwbGl0KCcuJyksIGZhbGxiYWNrKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvcGVydHlGcm9tSXRlbSAoXHJcbiAgaXRlbTogb2JqZWN0LFxyXG4gIHByb3BlcnR5OiBzdHJpbmcgfCAoc3RyaW5nIHwgbnVtYmVyKVtdIHwgKChpdGVtOiBvYmplY3QsIGZhbGxiYWNrPzogYW55KSA9PiBhbnkpLFxyXG4gIGZhbGxiYWNrPzogYW55XHJcbik6IGFueSB7XHJcbiAgaWYgKHByb3BlcnR5ID09IG51bGwpIHJldHVybiBpdGVtID09PSB1bmRlZmluZWQgPyBmYWxsYmFjayA6IGl0ZW1cclxuXHJcbiAgaWYgKGl0ZW0gIT09IE9iamVjdChpdGVtKSkgcmV0dXJuIGZhbGxiYWNrID09PSB1bmRlZmluZWQgPyBpdGVtIDogZmFsbGJhY2tcclxuXHJcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ3N0cmluZycpIHJldHVybiBnZXRPYmplY3RWYWx1ZUJ5UGF0aChpdGVtLCBwcm9wZXJ0eSwgZmFsbGJhY2spXHJcblxyXG4gIGlmIChBcnJheS5pc0FycmF5KHByb3BlcnR5KSkgcmV0dXJuIGdldE5lc3RlZFZhbHVlKGl0ZW0sIHByb3BlcnR5LCBmYWxsYmFjaylcclxuXHJcbiAgaWYgKHR5cGVvZiBwcm9wZXJ0eSAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbGxiYWNrXHJcblxyXG4gIGNvbnN0IHZhbHVlID0gcHJvcGVydHkoaXRlbSwgZmFsbGJhY2spXHJcblxyXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnID8gZmFsbGJhY2sgOiB2YWx1ZVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmFuZ2UgKGxlbmd0aDogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoIH0sICh2LCBrKSA9PiBrKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0WkluZGV4IChlbD86IEVsZW1lbnQgfCBudWxsKTogbnVtYmVyIHtcclxuICBpZiAoIWVsIHx8IGVsLm5vZGVUeXBlICE9PSBOb2RlLkVMRU1FTlRfTk9ERSkgcmV0dXJuIDBcclxuXHJcbiAgY29uc3QgaW5kZXggPSArd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKVxyXG5cclxuICBpZiAoaXNOYU4oaW5kZXgpKSByZXR1cm4gZ2V0WkluZGV4KGVsLnBhcmVudE5vZGUgYXMgRWxlbWVudClcclxuICByZXR1cm4gaW5kZXhcclxufVxyXG5cclxuY29uc3QgdGFnc1RvUmVwbGFjZSA9IHtcclxuICAnJic6ICcmYW1wOycsXHJcbiAgJzwnOiAnJmx0OycsXHJcbiAgJz4nOiAnJmd0OydcclxufSBhcyBhbnlcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVIVE1MIChzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bJjw+XS9nLCB0YWcgPT4gdGFnc1RvUmVwbGFjZVt0YWddIHx8IHRhZylcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlck9iamVjdE9uS2V5czxULCBLIGV4dGVuZHMga2V5b2YgVD4gKG9iajogVCwga2V5czogS1tdKTogeyBbTiBpbiBLXTogVFtOXSB9IHtcclxuICBjb25zdCBmaWx0ZXJlZCA9IHt9IGFzIHsgW04gaW4gS106IFRbTl0gfVxyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGNvbnN0IGtleSA9IGtleXNbaV1cclxuICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGZpbHRlcmVkW2tleV0gPSBvYmpba2V5XVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGZpbHRlcmVkXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJDaGlsZHJlbiAoYXJyYXk6IFZOb2RlW10gPSBbXSwgdGFnOiBzdHJpbmcpOiBWTm9kZVtdIHtcclxuICByZXR1cm4gYXJyYXkuZmlsdGVyKGNoaWxkID0+IHtcclxuICAgIHJldHVybiBjaGlsZC5jb21wb25lbnRPcHRpb25zICYmXHJcbiAgICAgIGNoaWxkLmNvbXBvbmVudE9wdGlvbnMuQ3Rvci5vcHRpb25zLm5hbWUgPT09IHRhZ1xyXG4gIH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG9Vbml0IChzdHI6IHN0cmluZyB8IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsIHVuaXQgPSAncHgnKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuICBpZiAoc3RyID09IG51bGwgfHwgc3RyID09PSAnJykge1xyXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxyXG4gIH0gZWxzZSBpZiAoaXNOYU4oK3N0ciEpKSB7XHJcbiAgICByZXR1cm4gU3RyaW5nKHN0cilcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGAke051bWJlcihzdHIpfSR7dW5pdH1gXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24ga2ViYWJDYXNlIChzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIChzdHIgfHwgJycpLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0IChvYmo6IGFueSk6IG9iaiBpcyBvYmplY3Qge1xyXG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcclxufVxyXG5cclxuLy8gS2V5Ym9hcmRFdmVudC5rZXlDb2RlIGFsaWFzZXNcclxuZXhwb3J0IGNvbnN0IGtleUNvZGVzID0gT2JqZWN0LmZyZWV6ZSh7XHJcbiAgZW50ZXI6IDEzLFxyXG4gIHRhYjogOSxcclxuICBkZWxldGU6IDQ2LFxyXG4gIGVzYzogMjcsXHJcbiAgc3BhY2U6IDMyLFxyXG4gIHVwOiAzOCxcclxuICBkb3duOiA0MCxcclxuICBsZWZ0OiAzNyxcclxuICByaWdodDogMzksXHJcbiAgZW5kOiAzNSxcclxuICBob21lOiAzNixcclxuICBkZWw6IDQ2LFxyXG4gIGJhY2tzcGFjZTogOCxcclxuICBpbnNlcnQ6IDQ1LFxyXG4gIHBhZ2V1cDogMzMsXHJcbiAgcGFnZWRvd246IDM0XHJcbn0pXHJcblxyXG5jb25zdCBJQ09OU19QUkVGSVggPSAnJHZ1ZXRpZnkuaWNvbnMuJ1xyXG5cclxuLy8gVGhpcyByZW1hcHMgaW50ZXJuYWwgbmFtZXMgbGlrZSAnJHZ1ZXRpZnkuaWNvbnMuY2FuY2VsJ1xyXG4vLyB0byB0aGUgY3VycmVudCBuYW1lIG9yIGNvbXBvbmVudCBmb3IgdGhhdCBpY29uLlxyXG5leHBvcnQgZnVuY3Rpb24gcmVtYXBJbnRlcm5hbEljb24gKHZtOiBWdWUsIGljb25OYW1lOiBzdHJpbmcpOiBWdWV0aWZ5SWNvbiB7XHJcbiAgaWYgKCFpY29uTmFtZS5zdGFydHNXaXRoKElDT05TX1BSRUZJWCkpIHtcclxuICAgIHJldHVybiBpY29uTmFtZVxyXG4gIH1cclxuXHJcbiAgLy8gTm93IGxvb2sgdXAgaWNvbiBpbmRpcmVjdGlvbiBuYW1lLCBlLmcuICckdnVldGlmeS5pY29ucy5jYW5jZWwnXHJcbiAgcmV0dXJuIGdldE9iamVjdFZhbHVlQnlQYXRoKHZtLCBpY29uTmFtZSwgaWNvbk5hbWUpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXlzPE8+IChvOiBPKSB7XHJcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG8pIGFzIChrZXlvZiBPKVtdXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDYW1lbGl6ZSBhIGh5cGhlbi1kZWxpbWl0ZWQgc3RyaW5nLlxyXG4gKi9cclxuY29uc3QgY2FtZWxpemVSRSA9IC8tKFxcdykvZ1xyXG5leHBvcnQgY29uc3QgY2FtZWxpemUgPSAoc3RyOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbGl6ZVJFLCAoXywgYykgPT4gYyA/IGMudG9VcHBlckNhc2UoKSA6ICcnKVxyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgc2V0IGRpZmZlcmVuY2Ugb2YgQiBhbmQgQSwgaS5lLiB0aGUgc2V0IG9mIGVsZW1lbnRzIGluIEIgYnV0IG5vdCBpbiBBXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlEaWZmIChhOiBhbnlbXSwgYjogYW55W10pOiBhbnlbXSB7XHJcbiAgY29uc3QgZGlmZiA9IFtdXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoYS5pbmRleE9mKGJbaV0pIDwgMCkgZGlmZi5wdXNoKGJbaV0pXHJcbiAgfVxyXG4gIHJldHVybiBkaWZmXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYWtlcyB0aGUgZmlyc3QgY2hhcmFjdGVyIG9mIGEgc3RyaW5nIHVwcGVyY2FzZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHVwcGVyRmlyc3QgKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZXR1cm5zOlxyXG4gKiAgLSAnbm9ybWFsJyBmb3Igb2xkIHN0eWxlIHNsb3RzIC0gYDx0ZW1wbGF0ZSBzbG90PVwiZGVmYXVsdFwiPmBcclxuICogIC0gJ3Njb3BlZCcgZm9yIG9sZCBzdHlsZSBzY29wZWQgc2xvdHMgKGA8dGVtcGxhdGUgc2xvdD1cImRlZmF1bHRcIiBzbG90LXNjb3BlPVwiZGF0YVwiPmApIG9yIGJvdW5kIHYtc2xvdCAoYCNkZWZhdWx0PVwiZGF0YVwiYClcclxuICogIC0gJ3Ytc2xvdCcgZm9yIHVuYm91bmQgdi1zbG90IChgI2RlZmF1bHRgKSAtIG9ubHkgaWYgdGhlIHRoaXJkIHBhcmFtIGlzIHRydWUsIG90aGVyd2lzZSBjb3VudHMgYXMgc2NvcGVkXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2xvdFR5cGU8VCBleHRlbmRzIGJvb2xlYW4gPSBmYWxzZT4gKHZtOiBWdWUsIG5hbWU6IHN0cmluZywgc3BsaXQ/OiBUKTogKFQgZXh0ZW5kcyB0cnVlID8gJ3Ytc2xvdCcgOiBuZXZlcikgfCAnbm9ybWFsJyB8ICdzY29wZWQnIHwgdm9pZCB7XHJcbiAgaWYgKHZtLiRzbG90c1tuYW1lXSAmJiB2bS4kc2NvcGVkU2xvdHNbbmFtZV0gJiYgKHZtLiRzY29wZWRTbG90c1tuYW1lXSBhcyBhbnkpLm5hbWUpIHtcclxuICAgIHJldHVybiBzcGxpdCA/ICd2LXNsb3QnIGFzIGFueSA6ICdzY29wZWQnXHJcbiAgfVxyXG4gIGlmICh2bS4kc2xvdHNbbmFtZV0pIHJldHVybiAnbm9ybWFsJ1xyXG4gIGlmICh2bS4kc2NvcGVkU2xvdHNbbmFtZV0pIHJldHVybiAnc2NvcGVkJ1xyXG59XHJcbiJdfQ==