/*!
 * Datepicker v0.6.4
 * https://github.com/fengyuanchen/datepicker
 *
 * Copyright (c) 2014-2017 Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2017-11-24T14:38:23.820Z
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
        typeof define === 'function' && define.amd ? define(['jquery'], factory) :
            (factory(global.jQuery));
}(this, (function ($) { 'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

    var DEFAULTS = {
        // Show the datepicker automatically when initialized
        autoShow: false,

        // Hide the datepicker automatically when picked
        autoHide: false,

        // Pick the initial date automatically when initialized
        autoPick: false,

        // Enable inline mode
        inline: false,

        // A element (or selector) for putting the datepicker
        container: null,

        // A element (or selector) for triggering the datepicker
        trigger: null,

        // The ISO language code (built-in: en-US)
        language: '',

        // The date string format
        format: 'mm/dd/yyyy',

        // The initial date
        date: null,

        // The start view date
        startDate: null,

        // The end view date
        endDate: null,

        // The start view when initialized
        startView: 0, // 0 for days, 1 for months, 2 for years

        // The start day of the week
        // 0 for Sunday, 1 for Monday, 2 for Tuesday, 3 for Wednesday,
        // 4 for Thursday, 5 for Friday, 6 for Saturday
        weekStart: 0,

        // Show year before month on the datepicker header
        yearFirst: false,

        // A string suffix to the year number.
        yearSuffix: '',

        // Days' name of the week.
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

        // Shorter days' name
        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

        // Shortest days' name
        daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

        // Months' name
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

        // Shorter months' name
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        // A element tag for each item of years, months and days
        itemTag: 'li',

        // A class (CSS) for muted date item
        mutedClass: 'muted',

        // A class (CSS) for picked date item
        pickedClass: 'picked',

        // A class (CSS) for disabled date item
        disabledClass: 'disabled',

        // A class (CSS) for highlight date item
        highlightedClass: 'highlighted',

        // The template of the datepicker
        template: '<div class="datepicker-container">' + '<div class="datepicker-panel" data-view="years picker">' + '<ul>' + '<li data-view="years prev">&lsaquo;</li>' + '<li data-view="years current"></li>' + '<li data-view="years next">&rsaquo;</li>' + '</ul>' + '<ul data-view="years"></ul>' + '</div>' + '<div class="datepicker-panel" data-view="months picker">' + '<ul>' + '<li data-view="year prev">&lsaquo;</li>' + '<li data-view="year current"></li>' + '<li data-view="year next">&rsaquo;</li>' + '</ul>' + '<ul data-view="months"></ul>' + '</div>' + '<div class="datepicker-panel" data-view="days picker">' + '<ul>' + '<li data-view="month prev">&lsaquo;</li>' + '<li data-view="month current"></li>' + '<li data-view="month next">&rsaquo;</li>' + '</ul>' + '<ul data-view="week"></ul>' + '<ul data-view="days"></ul>' + '</div>' + '</div>',

        // The offset top or bottom of the datepicker from the element
        offset: 10,

        // The `z-index` of the datepicker
        zIndex: 1000,

        // Filter each date item (return `false` to disable a date item)
        filter: null,

        // Event shortcuts
        show: null,
        hide: null,
        pick: null
    };

    var WINDOW = typeof window !== 'undefined' ? window : {};
    var NAMESPACE = 'datepicker';
    var EVENT_CLICK = 'click.' + NAMESPACE;
    var EVENT_FOCUS = 'focus.' + NAMESPACE;
    var EVENT_HIDE = 'hide.' + NAMESPACE;
    var EVENT_KEYUP = 'keyup.' + NAMESPACE;
    var EVENT_PICK = 'pick.' + NAMESPACE;
    var EVENT_RESIZE = 'resize.' + NAMESPACE;
    var EVENT_SHOW = 'show.' + NAMESPACE;
    var CLASS_HIDE = NAMESPACE + '-hide';
    var LANGUAGES = {};
    var VIEWS = {
        DAYS: 0,
        MONTHS: 1,
        YEARS: 2
    };

    var toString = Object.prototype.toString;


    function typeOf(obj) {
        return toString.call(obj).slice(8, -1).toLowerCase();
    }

    function isString(value) {
        return typeof value === 'string';
    }

    var isNaN = Number.isNaN || WINDOW.isNaN;

    function isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    function isDate(value) {
        return typeOf(value) === 'date';
    }

    function proxy(fn, context) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
        }

        return function () {
            for (var _len2 = arguments.length, args2 = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args2[_key2] = arguments[_key2];
            }

            return fn.apply(context, args.concat(args2));
        };
    }

    function selectorOf(view) {
        return '[data-view="' + view + '"]';
    }

    function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }

    function getDaysInMonth(year, month) {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    function getMinDay(year, month, day) {
        return Math.min(day, getDaysInMonth(year, month));
    }

    var formatParts = /(y|m|d)+/g;

    function parseFormat(format) {
        var source = String(format).toLowerCase();
        var parts = source.match(formatParts);

        if (!parts || parts.length === 0) {
            throw new Error('Invalid date format.');
        }

        format = {
            source: source,
            parts: parts
        };

        $.each(parts, function (i, part) {
            switch (part) {
                case 'dd':
                case 'd':
                    format.hasDay = true;
                    break;

                case 'mm':
                case 'm':
                    format.hasMonth = true;
                    break;

                case 'yyyy':
                case 'yy':
                    format.hasYear = true;
                    break;

                default:
            }
        });

        return format;
    }

    var REGEXP_DIGITS = /\d+/g;

    var methods = {
        // Show the datepicker
        show: function show() {
            if (!this.built) {
                this.build();
            }

            if (this.shown) {
                return;
            }

            if (this.trigger(EVENT_SHOW).isDefaultPrevented()) {
                return;
            }

            this.shown = true;
            this.$picker.removeClass(CLASS_HIDE).on(EVENT_CLICK, $.proxy(this.click, this));
            this.showView(this.options.startView);

            if (!this.inline) {
                $(window).on(EVENT_RESIZE, this.onResize = proxy(this.place, this));
                $(document).on(EVENT_CLICK, this.onGlobalClick = proxy(this.globalClick, this));
                $(document).on(EVENT_KEYUP, this.onGlobalKeyup = proxy(this.globalKeyup, this));
                this.place();
            }
        },


        // Hide the datepicker
        hide: function hide() {
            if (!this.shown) {
                return;
            }

            if (this.trigger(EVENT_HIDE).isDefaultPrevented()) {
                return;
            }

            this.shown = false;
            this.$picker.addClass(CLASS_HIDE).off(EVENT_CLICK, this.click);

            if (!this.inline) {
                $(window).off(EVENT_RESIZE, this.onResize);
                $(document).off(EVENT_CLICK, this.onGlobalClick);
                $(document).off(EVENT_KEYUP, this.onGlobalKeyup);
            }
        },
        toggle: function toggle() {
            if (this.shown) {
                this.hide();
            } else {
                this.show();
            }
        },


        // Update the datepicker with the current input value
        update: function update() {
            var value = this.getValue();

            if (value === this.oldValue) {
                return;
            }

            this.setDate(value, true);
            this.oldValue = value;
        },


        /**
         * Pick the current date to the element
         *
         * @param {String} _view (private)
         */
        pick: function pick(_view) {
            var $this = this.$element;
            var date = this.date;


            if (this.trigger(EVENT_PICK, {
                    view: _view || '',
                    date: date
                }).isDefaultPrevented()) {
                return;
            }

            date = this.formatDate(this.date);
            this.setValue(date);

            if (this.isInput) {
                $this.trigger('input');
                $this.trigger('change');
            }
        },


        // Reset the datepicker
        reset: function reset() {
            this.setDate(this.initialDate, true);
            this.setValue(this.initialValue);

            if (this.shown) {
                this.showView(this.options.startView);
            }
        },


        /**
         * Get the month name with given argument or the current date
         *
         * @param {Number} month (optional)
         * @param {Boolean} short (optional)
         * @return {String} (month name)
         */
        getMonthName: function getMonthName(month, short) {
            var options = this.options;
            var monthsShort = options.monthsShort;
            var months = options.months;


            if ($.isNumeric(month)) {
                month = Number(month);
            } else if (isUndefined(short)) {
                short = month;
            }

            if (short === true) {
                months = monthsShort;
            }

            return months[isNumber(month) ? month : this.date.getMonth()];
        },


        /**
         * Get the day name with given argument or the current date
         *
         * @param {Number} day (optional)
         * @param {Boolean} short (optional)
         * @param {Boolean} min (optional)
         * @return {String} (day name)
         */
        getDayName: function getDayName(day, short, min) {
            var options = this.options;
            var days = options.days;


            if ($.isNumeric(day)) {
                day = Number(day);
            } else {
                if (isUndefined(min)) {
                    min = short;
                }

                if (isUndefined(short)) {
                    short = day;
                }
            }

            if (min) {
                days = options.daysMin;
            } else if (short) {
                days = options.daysShort;
            }

            return days[isNumber(day) ? day : this.date.getDay()];
        },


        /**
         * Get the current date
         *
         * @param {Boolean} formatted (optional)
         * @return {Date|String} (date)
         */
        getDate: function getDate(formatted) {
            var date = this.date;


            return formatted ? this.formatDate(date) : new Date(date);
        },


        /**
         * Set the current date with a new date
         *
         * @param {Date} date
         * @param {Boolean} _updated (private)
         */
        setDate: function setDate(date, _updated) {
            var filter = this.options.filter;


            if (isDate(date) || isString(date)) {
                date = this.parseDate(date);

                if ($.isFunction(filter) && filter.call(this.$element, date) === false) {
                    return;
                }

                this.date = date;
                this.viewDate = new Date(date);

                if (!_updated) {
                    this.pick();
                }

                if (this.built) {
                    this.render();
                }
            }
        },


        /**
         * Set the start view date with a new date
         *
         * @param {Date} date
         */
        setStartDate: function setStartDate(date) {
            if (isDate(date) || isString(date)) {
                this.startDate = this.parseDate(date);

                if (this.built) {
                    this.render();
                }
            }
        },


        /**
         * Set the end view date with a new date
         *
         * @param {Date} date
         */
        setEndDate: function setEndDate(date) {
            if (isDate(date) || isString(date)) {
                this.endDate = this.parseDate(date);

                if (this.built) {
                    this.render();
                }
            }
        },


        /**
         * Parse a date string with the set date format
         *
         * @param {String} date
         * @return {Date} (parsed date)
         */
        parseDate: function parseDate(date) {
            var format = this.format;

            var parts = [];

            if (isDate(date)) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            } else if (isString(date)) {
                parts = date.match(REGEXP_DIGITS) || [];
            }

            date = new Date();

            var length = format.parts.length;

            var year = date.getFullYear();
            var day = date.getDate();
            var month = date.getMonth();

            if (parts.length === length) {
                $.each(parts, function (i, part) {
                    var value = parseInt(part, 10) || 1;

                    switch (format.parts[i]) {
                        case 'dd':
                        case 'd':
                            day = value;
                            break;

                        case 'mm':
                        case 'm':
                            month = value - 1;
                            break;

                        case 'yy':
                            year = 2000 + value;
                            break;

                        case 'yyyy':
                            year = value;
                            break;

                        default:
                    }
                });
            }

            return new Date(year, month, day);
        },


        /**
         * Format a date object to a string with the set date format
         *
         * @param {Date} date
         * @return {String} (formatted date)
         */
        formatDate: function formatDate(date) {
            var format = this.format;

            var formatted = '';

            if (isDate(date)) {
                var year = date.getFullYear();
                var values = {
                    d: date.getDate(),
                    m: date.getMonth() + 1,
                    yy: year.toString().substring(2),
                    yyyy: year
                };

                values.dd = (values.d < 10 ? '0' : '') + values.d;
                values.mm = (values.m < 10 ? '0' : '') + values.m;
                formatted = format.source;
                $.each(format.parts, function (i, part) {
                    formatted = formatted.replace(part, values[part]);
                });
            }

            return formatted;
        },


        // Destroy the datepicker and remove the instance from the target element
        destroy: function destroy() {
            this.unbind();
            this.unbuild();
            this.$element.removeData(NAMESPACE);
        }
    };

    var handlers = {
        click: function click(e) {
            var $target = $(e.target);
            var options = this.options,
                viewDate = this.viewDate,
                format = this.format;


            e.stopPropagation();
            e.preventDefault();

            if ($target.hasClass('disabled')) {
                return;
            }

            var view = $target.data('view');
            var viewYear = viewDate.getFullYear();
            var viewMonth = viewDate.getMonth();
            var viewDay = viewDate.getDate();

            switch (view) {
                case 'years prev':
                case 'years next':
                {
                    viewYear = view === 'years prev' ? viewYear - 10 : viewYear + 10;
                    this.viewDate = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));
                    this.renderYears();
                    break;
                }

                case 'year prev':
                case 'year next':
                    viewYear = view === 'year prev' ? viewYear - 1 : viewYear + 1;
                    this.viewDate = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));
                    this.renderMonths();
                    break;

                case 'year current':
                    if (format.hasYear) {
                        this.showView(VIEWS.YEARS);
                    }

                    break;

                case 'year picked':
                    if (format.hasMonth) {
                        this.showView(VIEWS.MONTHS);
                    } else {
                        $target.addClass(options.pickedClass).siblings().removeClass(options.pickedClass);
                        this.hideView();
                    }

                    this.pick('year');
                    break;

                case 'year':
                    viewYear = parseInt($target.text(), 10);
                    this.date = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));

                    if (format.hasMonth) {
                        this.viewDate = new Date(this.date);
                        this.showView(VIEWS.MONTHS);
                    } else {
                        $target.addClass(options.pickedClass).siblings().removeClass(options.pickedClass);
                        this.hideView();
                    }

                    this.pick('year');
                    break;

                case 'month prev':
                case 'month next':
                    viewMonth = view === 'month prev' ? viewMonth - 1 : viewMonth + 1;

                    if (viewMonth < 0) {
                        viewYear -= 1;
                        viewMonth += 12;
                    } else if (viewMonth > 11) {
                        viewYear += 1;
                        viewMonth -= 12;
                    }

                    this.viewDate = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));
                    this.renderDays();
                    break;

                case 'month current':
                    if (format.hasMonth) {
                        this.showView(VIEWS.MONTHS);
                    }

                    break;

                case 'month picked':
                    if (format.hasDay) {
                        this.showView(VIEWS.DAYS);
                    } else {
                        $target.addClass(options.pickedClass).siblings().removeClass(options.pickedClass);
                        this.hideView();
                    }

                    this.pick('month');
                    break;

                case 'month':
                    viewMonth = $.inArray($target.text(), options.monthsShort);
                    this.date = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));

                    if (format.hasDay) {
                        this.viewDate = new Date(viewYear, viewMonth, getMinDay(viewYear, viewMonth, viewDay));
                        this.showView(VIEWS.DAYS);
                    } else {
                        $target.addClass(options.pickedClass).siblings().removeClass(options.pickedClass);
                        this.hideView();
                    }

                    this.pick('month');
                    break;

                case 'day prev':
                case 'day next':
                case 'day':
                    if (view === 'day prev') {
                        viewMonth -= 1;
                    } else if (view === 'day next') {
                        viewMonth += 1;
                    }

                    viewDay = parseInt($target.text(), 10);
                    this.date = new Date(viewYear, viewMonth, viewDay);
                    this.viewDate = new Date(viewYear, viewMonth, viewDay);
                    this.renderDays();

                    if (view === 'day') {
                        this.hideView();
                    }

                    this.pick('day');
                    break;

                case 'day picked':
                    this.hideView();
                    this.pick('day');
                    break;

                default:
            }
        },
        globalClick: function globalClick(_ref) {
            var target = _ref.target;
            var element = this.element,
                $trigger = this.$trigger;

            var trigger = $trigger[0];
            var hidden = true;

            while (target !== document) {
                if (target === trigger || target === element) {
                    hidden = false;
                    break;
                }

                target = target.parentNode;
            }

            if (hidden) {
                this.hide();
            }
        },
        keyup: function keyup() {
            this.update();
        },
        globalKeyup: function globalKeyup(_ref2) {
            var target = _ref2.target,
                key = _ref2.key,
                keyCode = _ref2.keyCode;

            if (this.isInput && target !== this.element && this.shown && (key === 'Tab' || keyCode === 9)) {
                this.hide();
            }
        }
    };

    var render = {
        render: function render() {
            this.renderYears();
            this.renderMonths();
            this.renderDays();
        },
        renderWeek: function renderWeek() {
            var _this = this;

            var items = [];
            var _options = this.options,
                weekStart = _options.weekStart,
                daysMin = _options.daysMin;


            weekStart = parseInt(weekStart, 10) % 7;
            daysMin = daysMin.slice(weekStart).concat(daysMin.slice(0, weekStart));
            $.each(daysMin, function (i, day) {
                items.push(_this.createItem({
                    text: day
                }));
            });

            this.$week.html(items.join(''));
        },
        renderYears: function renderYears() {
            var options = this.options,
                startDate = this.startDate,
                endDate = this.endDate;
            var disabledClass = options.disabledClass,
                filter = options.filter,
                yearSuffix = options.yearSuffix;

            var viewYear = this.viewDate.getFullYear();
            var now = new Date();
            var thisYear = now.getFullYear();
            var year = this.date.getFullYear();
            var start = -5;
            var end = 6;
            var items = [];
            var prevDisabled = false;
            var nextDisabled = false;
            var i = void 0;

            for (i = start; i <= end; i += 1) {
                var date = new Date(viewYear + i, 1, 1);
                var disabled = false;

                if (startDate) {
                    disabled = date.getFullYear() < startDate.getFullYear();

                    if (i === start) {
                        prevDisabled = disabled;
                    }
                }

                if (!disabled && endDate) {
                    disabled = date.getFullYear() > endDate.getFullYear();

                    if (i === end) {
                        nextDisabled = disabled;
                    }
                }

                if (!disabled && filter) {
                    disabled = filter.call(this.$element, date) === false;
                }

                var picked = viewYear + i === year;
                var view = picked ? 'year picked' : 'year';

                items.push(this.createItem({
                    picked: picked,
                    disabled: disabled,
                    muted: i === start || i === end,
                    text: viewYear + i,
                    view: disabled ? 'year disabled' : view,
                    highlighted: date.getFullYear() === thisYear
                }));
            }

            this.$yearsPrev.toggleClass(disabledClass, prevDisabled);
            this.$yearsNext.toggleClass(disabledClass, nextDisabled);
            this.$yearsCurrent.toggleClass(disabledClass, true).html(viewYear + start + yearSuffix + ' - ' + (viewYear + end) + yearSuffix);
            this.$years.html(items.join(''));
        },
        renderMonths: function renderMonths() {
            var options = this.options,
                startDate = this.startDate,
                endDate = this.endDate,
                viewDate = this.viewDate;

            var disabledClass = options.disabledClass || '';
            var months = options.monthsShort;
            var filter = $.isFunction(options.filter) && options.filter;
            var viewYear = viewDate.getFullYear();
            var now = new Date();
            var thisYear = now.getFullYear();
            var thisMonth = now.getMonth();
            var year = this.date.getFullYear();
            var month = this.date.getMonth();
            var items = [];
            var prevDisabled = false;
            var nextDisabled = false;
            var i = void 0;

            for (i = 0; i <= 11; i += 1) {
                var date = new Date(viewYear, i, 1);
                var disabled = false;

                if (startDate) {
                    prevDisabled = date.getFullYear() === startDate.getFullYear();
                    disabled = prevDisabled && date.getMonth() < startDate.getMonth();
                }

                if (!disabled && endDate) {
                    nextDisabled = date.getFullYear() === endDate.getFullYear();
                    disabled = nextDisabled && date.getMonth() > endDate.getMonth();
                }

                if (!disabled && filter) {
                    disabled = filter.call(this.$element, date) === false;
                }

                var picked = viewYear === year && i === month;
                var view = picked ? 'month picked' : 'month';

                items.push(this.createItem({
                    disabled: disabled,
                    picked: picked,
                    highlighted: viewYear === thisYear && date.getMonth() === thisMonth,
                    index: i,
                    text: months[i],
                    view: disabled ? 'month disabled' : view
                }));
            }

            this.$yearPrev.toggleClass(disabledClass, prevDisabled);
            this.$yearNext.toggleClass(disabledClass, nextDisabled);
            this.$yearCurrent.toggleClass(disabledClass, prevDisabled && nextDisabled).html(viewYear + options.yearSuffix || '');
            this.$months.html(items.join(''));
        },
        renderDays: function renderDays() {
            var $element = this.$element,
                options = this.options,
                startDate = this.startDate,
                endDate = this.endDate,
                viewDate = this.viewDate,
                currentDate = this.date;
            var disabledClass = options.disabledClass,
                filter = options.filter,
                monthsShort = options.monthsShort,
                weekStart = options.weekStart,
                yearSuffix = options.yearSuffix;

            var viewYear = viewDate.getFullYear();
            var viewMonth = viewDate.getMonth();
            var now = new Date();
            var thisYear = now.getFullYear();
            var thisMonth = now.getMonth();
            var thisDay = now.getDate();
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth();
            var day = currentDate.getDate();
            var length = void 0;
            var i = void 0;
            var n = void 0;

            // Days of prev month
            // -----------------------------------------------------------------------

            var prevItems = [];
            var prevViewYear = viewYear;
            var prevViewMonth = viewMonth;
            var prevDisabled = false;

            if (viewMonth === 0) {
                prevViewYear -= 1;
                prevViewMonth = 11;
            } else {
                prevViewMonth -= 1;
            }

            // The length of the days of prev month
            length = getDaysInMonth(prevViewYear, prevViewMonth);

            // The first day of current month
            var firstDay = new Date(viewYear, viewMonth, 1);

            // The visible length of the days of prev month
            // [0,1,2,3,4,5,6] - [0,1,2,3,4,5,6] => [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6]
            n = firstDay.getDay() - parseInt(weekStart, 10) % 7;

            // [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6] => [1,2,3,4,5,6,7]
            if (n <= 0) {
                n += 7;
            }

            if (startDate) {
                prevDisabled = firstDay.getTime() <= startDate.getTime();
            }

            for (i = length - (n - 1); i <= length; i += 1) {
                var prevViewDate = new Date(prevViewYear, prevViewMonth, i);
                var disabled = false;

                if (startDate) {
                    disabled = prevViewDate.getTime() < startDate.getTime();
                }

                if (!disabled && filter) {
                    disabled = filter.call($element, prevViewDate) === false;
                }

                prevItems.push(this.createItem({
                    disabled: disabled,
                    highlighted: prevViewYear === thisYear && prevViewMonth === thisMonth && prevViewDate.getDate() === thisDay,
                    muted: true,
                    picked: prevViewYear === year && prevViewMonth === month && i === day,
                    text: i,
                    view: 'day prev'
                }));
            }

            // Days of next month
            // -----------------------------------------------------------------------

            var nextItems = [];
            var nextViewYear = viewYear;
            var nextViewMonth = viewMonth;
            var nextDisabled = false;

            if (viewMonth === 11) {
                nextViewYear += 1;
                nextViewMonth = 0;
            } else {
                nextViewMonth += 1;
            }

            // The length of the days of current month
            length = getDaysInMonth(viewYear, viewMonth);

            // The visible length of next month (42 means 6 rows and 7 columns)
            n = 42 - (prevItems.length + length);

            // The last day of current month
            var lastDate = new Date(viewYear, viewMonth, length);

            if (endDate) {
                nextDisabled = lastDate.getTime() >= endDate.getTime();
            }

            for (i = 1; i <= n; i += 1) {
                var date = new Date(nextViewYear, nextViewMonth, i);
                var picked = nextViewYear === year && nextViewMonth === month && i === day;
                var _disabled = false;

                if (endDate) {
                    _disabled = date.getTime() > endDate.getTime();
                }

                if (!_disabled && filter) {
                    _disabled = filter.call($element, date) === false;
                }

                nextItems.push(this.createItem({
                    disabled: _disabled,
                    picked: picked,
                    highlighted: nextViewYear === thisYear && nextViewMonth === thisMonth && date.getDate() === thisDay,
                    muted: true,
                    text: i,
                    view: 'day next'
                }));
            }

            // Days of current month
            // -----------------------------------------------------------------------

            var items = [];

            for (i = 1; i <= length; i += 1) {
                var _date = new Date(viewYear, viewMonth, i);
                var _disabled2 = false;

                if (startDate) {
                    _disabled2 = _date.getTime() < startDate.getTime();
                }

                if (!_disabled2 && endDate) {
                    _disabled2 = _date.getTime() > endDate.getTime();
                }

                if (!_disabled2 && filter) {
                    _disabled2 = filter.call($element, _date) === false;
                }

                var _picked = viewYear === year && viewMonth === month && i === day;
                var view = _picked ? 'day picked' : 'day';

                items.push(this.createItem({
                    disabled: _disabled2,
                    picked: _picked,
                    highlighted: viewYear === thisYear && viewMonth === thisMonth && _date.getDate() === thisDay,
                    text: i,
                    view: _disabled2 ? 'day disabled' : view
                }));
            }

            // Render days picker
            // -----------------------------------------------------------------------

            this.$monthPrev.toggleClass(disabledClass, prevDisabled);
            this.$monthNext.toggleClass(disabledClass, nextDisabled);
            this.$monthCurrent.toggleClass(disabledClass, prevDisabled && nextDisabled).html(options.yearFirst ? viewYear + yearSuffix + ' ' + monthsShort[viewMonth] : monthsShort[viewMonth] + ' ' + viewYear + yearSuffix);
            this.$days.html(prevItems.join('') + items.join('') + nextItems.join(''));
        }
    };

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Classes
    var CLASS_TOP_LEFT = NAMESPACE + '-top-left';
    var CLASS_TOP_RIGHT = NAMESPACE + '-top-right';
    var CLASS_BOTTOM_LEFT = NAMESPACE + '-bottom-left';
    var CLASS_BOTTOM_RIGHT = NAMESPACE + '-bottom-right';
    var CLASS_PLACEMENTS = [CLASS_TOP_LEFT, CLASS_TOP_RIGHT, CLASS_BOTTOM_LEFT, CLASS_BOTTOM_RIGHT].join(' ');

    var Datepicker = function () {
        function Datepicker(element) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            _classCallCheck(this, Datepicker);

            this.$element = $(element);
            this.element = element;
            this.options = $.extend({}, DEFAULTS, LANGUAGES[options.language], options);
            this.built = false;
            this.shown = false;
            this.isInput = false;
            this.inline = false;
            this.initialValue = '';
            this.initialDate = null;
            this.startDate = null;
            this.endDate = null;
            this.init();
        }

        _createClass(Datepicker, [{
            key: 'init',
            value: function init() {
                var $this = this.$element,
                    options = this.options;
                var startDate = options.startDate,
                    endDate = options.endDate,
                    date = options.date;


                this.$trigger = $(options.trigger);
                this.isInput = $this.is('input') || $this.is('textarea');
                this.inline = options.inline && (options.container || !this.isInput);
                this.format = parseFormat(options.format);

                var initialValue = this.getValue();

                this.initialValue = initialValue;
                this.oldValue = initialValue;
                date = this.parseDate(date || initialValue);

                if (startDate) {
                    startDate = this.parseDate(startDate);

                    if (date.getTime() < startDate.getTime()) {
                        date = new Date(startDate);
                    }

                    this.startDate = startDate;
                }

                if (endDate) {
                    endDate = this.parseDate(endDate);

                    if (startDate && endDate.getTime() < startDate.getTime()) {
                        endDate = new Date(startDate);
                    }

                    if (date.getTime() > endDate.getTime()) {
                        date = new Date(endDate);
                    }

                    this.endDate = endDate;
                }

                this.date = date;
                this.viewDate = new Date(date);
                this.initialDate = new Date(this.date);
                this.bind();

                if (options.autoShow || this.inline) {
                    this.show();
                }

                if (options.autoPick) {
                    this.pick();
                }
            }
        }, {
            key: 'build',
            value: function build() {
                if (this.built) {
                    return;
                }

                this.built = true;

                var $this = this.$element,
                    options = this.options;

                var $picker = $(options.template);

                this.$picker = $picker;
                this.$week = $picker.find(selectorOf('week'));

                // Years view
                this.$yearsPicker = $picker.find(selectorOf('years picker'));
                this.$yearsPrev = $picker.find(selectorOf('years prev'));
                this.$yearsNext = $picker.find(selectorOf('years next'));
                this.$yearsCurrent = $picker.find(selectorOf('years current'));
                this.$years = $picker.find(selectorOf('years'));

                // Months view
                this.$monthsPicker = $picker.find(selectorOf('months picker'));
                this.$yearPrev = $picker.find(selectorOf('year prev'));
                this.$yearNext = $picker.find(selectorOf('year next'));
                this.$yearCurrent = $picker.find(selectorOf('year current'));
                this.$months = $picker.find(selectorOf('months'));

                // Days view
                this.$daysPicker = $picker.find(selectorOf('days picker'));
                this.$monthPrev = $picker.find(selectorOf('month prev'));
                this.$monthNext = $picker.find(selectorOf('month next'));
                this.$monthCurrent = $picker.find(selectorOf('month current'));
                this.$days = $picker.find(selectorOf('days'));

                if (this.inline) {
                    $(options.container || $this).append($picker.addClass(NAMESPACE + '-inline'));
                } else {
                    $(document.body).append($picker.addClass(NAMESPACE + '-dropdown'));
                    $picker.addClass(CLASS_HIDE);
                }

                this.renderWeek();
            }
        }, {
            key: 'unbuild',
            value: function unbuild() {
                if (!this.built) {
                    return;
                }

                this.built = false;
                this.$picker.remove();
            }
        }, {
            key: 'bind',
            value: function bind() {
                var options = this.options,
                    $this = this.$element;


                if ($.isFunction(options.show)) {
                    $this.on(EVENT_SHOW, options.show);
                }

                if ($.isFunction(options.hide)) {
                    $this.on(EVENT_HIDE, options.hide);
                }

                if ($.isFunction(options.pick)) {
                    $this.on(EVENT_PICK, options.pick);
                }

                if (this.isInput) {
                    $this.on(EVENT_KEYUP, $.proxy(this.keyup, this));
                }

                if (!this.inline) {
                    if (options.trigger) {
                        this.$trigger.on(EVENT_CLICK, $.proxy(this.toggle, this));
                    } else if (this.isInput) {
                        $this.on(EVENT_FOCUS, $.proxy(this.show, this));
                    } else {
                        $this.on(EVENT_CLICK, $.proxy(this.show, this));
                    }
                }
            }
        }, {
            key: 'unbind',
            value: function unbind() {
                var $this = this.$element,
                    options = this.options;


                if ($.isFunction(options.show)) {
                    $this.off(EVENT_SHOW, options.show);
                }

                if ($.isFunction(options.hide)) {
                    $this.off(EVENT_HIDE, options.hide);
                }

                if ($.isFunction(options.pick)) {
                    $this.off(EVENT_PICK, options.pick);
                }

                if (this.isInput) {
                    $this.off(EVENT_KEYUP, this.keyup);
                }

                if (!this.inline) {
                    if (options.trigger) {
                        this.$trigger.off(EVENT_CLICK, this.toggle);
                    } else if (this.isInput) {
                        $this.off(EVENT_FOCUS, this.show);
                    } else {
                        $this.off(EVENT_CLICK, this.show);
                    }
                }
            }
        }, {
            key: 'showView',
            value: function showView(view) {
                var $yearsPicker = this.$yearsPicker,
                    $monthsPicker = this.$monthsPicker,
                    $daysPicker = this.$daysPicker,
                    format = this.format;


                if (format.hasYear || format.hasMonth || format.hasDay) {
                    switch (Number(view)) {
                        case VIEWS.YEARS:
                            $monthsPicker.addClass(CLASS_HIDE);
                            $daysPicker.addClass(CLASS_HIDE);

                            if (format.hasYear) {
                                this.renderYears();
                                $yearsPicker.removeClass(CLASS_HIDE);
                                this.place();
                            } else {
                                this.showView(VIEWS.DAYS);
                            }

                            break;

                        case VIEWS.MONTHS:
                            $yearsPicker.addClass(CLASS_HIDE);
                            $daysPicker.addClass(CLASS_HIDE);

                            if (format.hasMonth) {
                                this.renderMonths();
                                $monthsPicker.removeClass(CLASS_HIDE);
                                this.place();
                            } else {
                                this.showView(VIEWS.YEARS);
                            }

                            break;

                        // case VIEWS.DAYS:
                        default:
                            $yearsPicker.addClass(CLASS_HIDE);
                            $monthsPicker.addClass(CLASS_HIDE);

                            if (format.hasDay) {
                                this.renderDays();
                                $daysPicker.removeClass(CLASS_HIDE);
                                this.place();
                            } else {
                                this.showView(VIEWS.MONTHS);
                            }
                    }
                }
            }
        }, {
            key: 'hideView',
            value: function hideView() {
                if (!this.inline && this.options.autoHide) {
                    this.hide();
                }
            }
        }, {
            key: 'place',
            value: function place() {
                if (this.inline) {
                    return;
                }

                var $this = this.$element,
                    options = this.options,
                    $picker = this.$picker;

                var containerWidth = $(document).outerWidth();
                var containerHeight = $(document).outerHeight();
                var elementWidth = $this.outerWidth();
                var elementHeight = $this.outerHeight();
                var width = $picker.width();
                var height = $picker.height();

                var _$this$offset = $this.offset(),
                    left = _$this$offset.left,
                    top = _$this$offset.top;

                var offset = parseFloat(options.offset);
                var placement = CLASS_TOP_LEFT;

                if (isNaN(offset)) {
                    offset = 10;
                }

                if (top > height && top + elementHeight + height > containerHeight) {
                    top -= height + offset;
                    placement = CLASS_BOTTOM_LEFT;
                } else {
                    top += elementHeight + offset;
                }

                if (left + width > containerWidth) {
                    left += elementWidth - width;
                    placement = placement.replace('left', 'right');
                }

                $picker.removeClass(CLASS_PLACEMENTS).addClass(placement).css({
                    top: top,
                    left: left,
                    zIndex: parseInt(options.zIndex, 10)
                });
            }

            // A shortcut for triggering custom events

        }, {
            key: 'trigger',
            value: function trigger(type, data) {
                var e = $.Event(type, data);

                this.$element.trigger(e);

                return e;
            }
        }, {
            key: 'createItem',
            value: function createItem(data) {
                var options = this.options;
                var itemTag = options.itemTag;

                var item = {
                    text: '',
                    view: '',
                    muted: false,
                    picked: false,
                    disabled: false,
                    highlighted: false
                };
                var classes = [];

                $.extend(item, data);

                if (item.muted) {
                    classes.push(options.mutedClass);
                }

                if (item.highlighted) {
                    classes.push(options.highlightedClass);
                }

                if (item.picked) {
                    classes.push(options.pickedClass);
                }

                if (item.disabled) {
                    classes.push(options.disabledClass);
                }

                return '<' + itemTag + ' class="' + classes.join(' ') + '" data-view="' + item.view + '">' + item.text + '</' + itemTag + '>';
            }
        }, {
            key: 'getValue',
            value: function getValue() {
                var $this = this.$element;

                return this.isInput ? $this.val() : $this.text();
            }
        }, {
            key: 'setValue',
            value: function setValue() {
                var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                var $this = this.$element;

                if (this.isInput) {
                    $this.val(value);
                } else {
                    $this.text(value);
                }
            }
        }], [{
            key: 'setDefaults',
            value: function setDefaults() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                $.extend(DEFAULTS, LANGUAGES[options.language], options);
            }
        }]);

        return Datepicker;
    }();

    if ($.extend) {
        $.extend(Datepicker.prototype, render, handlers, methods);
    }

    if ($.fn) {
        var AnotherDatepicker = $.fn.datepicker;

        $.fn.datepicker = function jQueryDatepicker(option) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            var result = void 0;

            this.each(function (i, element) {
                var $element = $(element);
                var data = $element.data(NAMESPACE);

                if (!data) {
                    if (/destroy/.test(option)) {
                        return;
                    }

                    var options = $.extend({}, $element.data(), $.isPlainObject(option) && option);

                    data = new Datepicker(element, options);
                    $element.data(NAMESPACE, data);
                }

                if (isString(option)) {
                    var fn = data[option];

                    if ($.isFunction(fn)) {
                        result = fn.apply(data, args);
                    }
                }
            });

            return isUndefined(result) ? this : result;
        };

        $.fn.datepicker.Constructor = Datepicker;
        $.fn.datepicker.languages = LANGUAGES;
        $.fn.datepicker.setDefaults = Datepicker.setDefaults;
        $.fn.datepicker.noConflict = function noConflict() {
            $.fn.datepicker = AnotherDatepicker;
            return this;
        };
    }

})));
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
        typeof define === 'function' && define.amd ? define(['jquery'], factory) :
            (factory(global.jQuery));
}(this, (function ($) {

    'use strict';

    $.fn.datepicker.languages['ru-RU'] = {
        format: 'dd.mm.YYYY',
        days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthsShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        weekStart: 1,
        startView: 0,
        yearFirst: false,
        yearSuffix: ''
    };
})));
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var ua = navigator.userAgent,
        iPhone = /iphone/i.test(ua),
        chrome = /chrome/i.test(ua),
        android = /android/i.test(ua),
        caretTimeoutId;

    $.mask = {
        //Predefined character definitions
        definitions: {
            '9': "[0-9]",
            'a': "[A-Za-z]",
            '*': "[A-Za-z0-9]"
        },
        autoclear: true,
        dataName: "rawMaskFn",
        placeholder: '_'
    };

    $.fn.extend({
        //Helper Function for Caret positioning
        caret: function(begin, end) {
            var range;

            if (this.length === 0 || this.is(":hidden") || this.get(0) !== document.activeElement) {
                return;
            }

            if (typeof begin == 'number') {
                end = (typeof end === 'number') ? end : begin;
                return this.each(function() {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this[0].selectionStart;
                    end = this[0].selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return { begin: begin, end: end };
            }
        },
        unmask: function() {
            return this.trigger("unmask");
        },
        mask: function(mask, settings) {
            var input,
                defs,
                tests,
                partialPosition,
                firstNonMaskPos,
                lastRequiredNonMaskPos,
                len,
                oldVal;

            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName)
                return fn?fn():undefined;
            }

            settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder, // Load default placeholder
                completed: null
            }, settings);


            defs = $.mask.definitions;
            tests = [];
            partialPosition = len = mask.length;
            firstNonMaskPos = null;

            mask = String(mask);

            $.each(mask.split(""), function(i, c) {
                if (c == '?') {
                    len--;
                    partialPosition = i;
                } else if (defs[c]) {
                    tests.push(new RegExp(defs[c]));
                    if (firstNonMaskPos === null) {
                        firstNonMaskPos = tests.length - 1;
                    }
                    if(i < partialPosition){
                        lastRequiredNonMaskPos = tests.length - 1;
                    }
                } else {
                    tests.push(null);
                }
            });

            return this.trigger("unmask").each(function() {
                var input = $(this),
                    buffer = $.map(
                        mask.split(""),
                        function(c, i) {
                            if (c != '?') {
                                return defs[c] ? getPlaceholder(i) : c;
                            }
                        }),
                    defaultBuffer = buffer.join(''),
                    focusText = input.val();

                function tryFireCompleted(){
                    if (!settings.completed) {
                        return;
                    }

                    for (var i = firstNonMaskPos; i <= lastRequiredNonMaskPos; i++) {
                        if (tests[i] && buffer[i] === getPlaceholder(i)) {
                            return;
                        }
                    }
                    settings.completed.call(input);
                }

                function getPlaceholder(i){
                    if(i < settings.placeholder.length)
                        return settings.placeholder.charAt(i);
                    return settings.placeholder.charAt(0);
                }

                function seekNext(pos) {
                    while (++pos < len && !tests[pos]);
                    return pos;
                }

                function seekPrev(pos) {
                    while (--pos >= 0 && !tests[pos]);
                    return pos;
                }

                function shiftL(begin,end) {
                    var i,
                        j;

                    if (begin<0) {
                        return;
                    }

                    for (i = begin, j = seekNext(end); i < len; i++) {
                        if (tests[i]) {
                            if (j < len && tests[i].test(buffer[j])) {
                                buffer[i] = buffer[j];
                                buffer[j] = getPlaceholder(j);
                            } else {
                                break;
                            }

                            j = seekNext(j);
                        }
                    }
                    writeBuffer();
                    input.caret(Math.max(firstNonMaskPos, begin));
                }

                function shiftR(pos) {
                    var i,
                        c,
                        j,
                        t;

                    for (i = pos, c = getPlaceholder(pos); i < len; i++) {
                        if (tests[i]) {
                            j = seekNext(i);
                            t = buffer[i];
                            buffer[i] = c;
                            if (j < len && tests[j].test(t)) {
                                c = t;
                            } else {
                                break;
                            }
                        }
                    }
                }

                function androidInputEvent(e) {
                    var curVal = input.val();
                    var pos = input.caret();
                    if (oldVal && oldVal.length && oldVal.length > curVal.length ) {
                        // a deletion or backspace happened
                        checkVal(true);
                        while (pos.begin > 0 && !tests[pos.begin-1])
                            pos.begin--;
                        if (pos.begin === 0)
                        {
                            while (pos.begin < firstNonMaskPos && !tests[pos.begin])
                                pos.begin++;
                        }
                        input.caret(pos.begin,pos.begin);
                    } else {
                        var pos2 = checkVal(true);
                        var lastEnteredValue = curVal.charAt(pos.begin);
                        if (pos.begin < len){
                            if(!tests[pos.begin]){
                                pos.begin++;
                                if(tests[pos.begin].test(lastEnteredValue)){
                                    pos.begin++;
                                }
                            }else{
                                if(tests[pos.begin].test(lastEnteredValue)){
                                    pos.begin++;
                                }
                            }
                        }
                        input.caret(pos.begin,pos.begin);
                    }
                    tryFireCompleted();
                }


                function blurEvent(e) {
                    checkVal();

                    if (input.val() != focusText)
                        input.change();
                }

                function keydownEvent(e) {
                    if (input.prop("readonly")){
                        return;
                    }

                    var k = e.which || e.keyCode,
                        pos,
                        begin,
                        end;
                    oldVal = input.val();
                    //backspace, delete, and escape get special treatment
                    if (k === 8 || k === 46 || (iPhone && k === 127)) {
                        pos = input.caret();
                        begin = pos.begin;
                        end = pos.end;

                        if (end - begin === 0) {
                            begin=k!==46?seekPrev(begin):(end=seekNext(begin-1));
                            end=k===46?seekNext(end):end;
                        }
                        clearBuffer(begin, end);
                        shiftL(begin, end - 1);

                        e.preventDefault();
                    } else if( k === 13 ) { // enter
                        blurEvent.call(this, e);
                    } else if (k === 27) { // escape
                        input.val(focusText);
                        input.caret(0, checkVal());
                        e.preventDefault();
                    }
                }

                function keypressEvent(e) {
                    if (input.prop("readonly")){
                        return;
                    }

                    var k = e.which || e.keyCode,
                        pos = input.caret(),
                        p,
                        c,
                        next;

                    if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
                        return;
                    } else if ( k && k !== 13 ) {
                        if (pos.end - pos.begin !== 0){
                            clearBuffer(pos.begin, pos.end);
                            shiftL(pos.begin, pos.end-1);
                        }

                        p = seekNext(pos.begin - 1);
                        if (p < len) {
                            c = String.fromCharCode(k);
                            if (tests[p].test(c)) {
                                shiftR(p);

                                buffer[p] = c;
                                writeBuffer();
                                next = seekNext(p);

                                if(android){
                                    //Path for CSP Violation on FireFox OS 1.1
                                    var proxy = function() {
                                        $.proxy($.fn.caret,input,next)();
                                    };

                                    setTimeout(proxy,0);
                                }else{
                                    input.caret(next);
                                }
                                if(pos.begin <= lastRequiredNonMaskPos){
                                    tryFireCompleted();
                                }
                            }
                        }
                        e.preventDefault();
                    }
                }

                function clearBuffer(start, end) {
                    var i;
                    for (i = start; i < end && i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = getPlaceholder(i);
                        }
                    }
                }

                function writeBuffer() { input.val(buffer.join('')); }

                function checkVal(allow) {
                    //try to place characters where they belong
                    var test = input.val(),
                        lastMatch = -1,
                        i,
                        c,
                        pos;

                    for (i = 0, pos = 0; i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = getPlaceholder(i);
                            while (pos++ < test.length) {
                                c = test.charAt(pos - 1);
                                if (tests[i].test(c)) {
                                    buffer[i] = c;
                                    lastMatch = i;
                                    break;
                                }
                            }
                            if (pos > test.length) {
                                clearBuffer(i + 1, len);
                                break;
                            }
                        } else {
                            if (buffer[i] === test.charAt(pos)) {
                                pos++;
                            }
                            if( i < partialPosition){
                                lastMatch = i;
                            }
                        }
                    }
                    if (allow) {
                        writeBuffer();
                    } else if (lastMatch + 1 < partialPosition) {
                        if (settings.autoclear || buffer.join('') === defaultBuffer) {
                            // Invalid value. Remove it and replace it with the
                            // mask, which is the default behavior.
                            if(input.val()) input.val("");
                            clearBuffer(0, len);
                        } else {
                            // Invalid value, but we opt to show the value to the
                            // user and allow them to correct their mistake.
                            writeBuffer();
                        }
                    } else {
                        writeBuffer();
                        input.val(input.val().substring(0, lastMatch + 1));
                    }
                    return (partialPosition ? i : firstNonMaskPos);
                }

                input.data($.mask.dataName,function(){
                    return $.map(buffer, function(c, i) {
                        return tests[i]&&c!=getPlaceholder(i) ? c : null;
                    }).join('');
                });


                input
                    .one("unmask", function() {
                        input
                            .off(".mask")
                            .removeData($.mask.dataName);
                    })
                    .on("focus.mask", function() {
                        if (input.prop("readonly")){
                            return;
                        }

                        clearTimeout(caretTimeoutId);
                        var pos;

                        focusText = input.val();

                        pos = checkVal();

                        caretTimeoutId = setTimeout(function(){
                            if(input.get(0) !== document.activeElement){
                                return;
                            }
                            writeBuffer();
                            if (pos == mask.replace("?","").length) {
                                input.caret(0, pos);
                            } else {
                                input.caret(pos);
                            }
                        }, 10);
                    })
                    .on("blur.mask", blurEvent)
                    .on("keydown.mask", keydownEvent)
                    .on("keypress.mask", keypressEvent)
                    .on("input.mask paste.mask", function() {
                        if (input.prop("readonly")){
                            return;
                        }

                        setTimeout(function() {
                            var pos=checkVal(true);
                            input.caret(pos);
                            tryFireCompleted();
                        }, 0);
                    });
                if (chrome && android)
                {
                    input
                        .off('input.mask')
                        .on('input.mask', androidInputEvent);
                }
                checkVal(); //Perform initial check for existing values
            });
        }
    });
}));
// jQuery RoyalSlider plugin. Custom build. Copyright 2011-2015 Dmitry Semenov http://dimsemenov.com 
// http://dimsemenov.com/private/home.php?build=bullets_thumbnails_tabs_fullscreen_autoplay_video_animated-blocks_auto-height_global-caption_active-class_deeplinking_visible-nearby 
// jquery.royalslider v9.5.8
(function(n){function v(b,f){var c,a=this,e=window.navigator,g=e.userAgent.toLowerCase();a.uid=n.rsModules.uid++;a.ns=".rs"+a.uid;var d=document.createElement("div").style,h=["webkit","Moz","ms","O"],k="",l=0,q;for(c=0;c<h.length;c++)q=h[c],!k&&q+"Transform"in d&&(k=q),q=q.toLowerCase(),window.requestAnimationFrame||(window.requestAnimationFrame=window[q+"RequestAnimationFrame"],window.cancelAnimationFrame=window[q+"CancelAnimationFrame"]||window[q+"CancelRequestAnimationFrame"]);window.requestAnimationFrame||
(window.requestAnimationFrame=function(a,b){var c=(new Date).getTime(),d=Math.max(0,16-(c-l)),e=window.setTimeout(function(){a(c+d)},d);l=c+d;return e});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});a.isIPAD=g.match(/(ipad)/);a.isIOS=a.isIPAD||g.match(/(iphone|ipod)/);c=function(a){a=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||0>a.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||
[];return{browser:a[1]||"",version:a[2]||"0"}}(g);h={};c.browser&&(h[c.browser]=!0,h.version=c.version);h.chrome&&(h.webkit=!0);a._a=h;a.isAndroid=-1<g.indexOf("android");a.slider=n(b);a.ev=n(a);a._b=n(document);a.st=n.extend({},n.fn.royalSlider.defaults,f);a._c=a.st.transitionSpeed;a._d=0;!a.st.allowCSS3||h.webkit&&!a.st.allowCSS3OnWebkit||(c=k+(k?"T":"t"),a._e=c+"ransform"in d&&c+"ransition"in d,a._e&&(a._f=k+(k?"P":"p")+"erspective"in d));k=k.toLowerCase();a._g="-"+k+"-";a._h="vertical"===a.st.slidesOrientation?
!1:!0;a._i=a._h?"left":"top";a._j=a._h?"width":"height";a._k=-1;a._l="fade"===a.st.transitionType?!1:!0;a._l||(a.st.sliderDrag=!1,a._m=10);a._n="z-index:0; display:none; opacity:0;";a._o=0;a._p=0;a._q=0;n.each(n.rsModules,function(b,c){"uid"!==b&&c.call(a)});a.slides=[];a._r=0;(a.st.slides?n(a.st.slides):a.slider.children().detach()).each(function(){a._s(this,!0)});a.st.randomizeSlides&&a.slides.sort(function(){return.5-Math.random()});a.numSlides=a.slides.length;a._t();a.st.startSlideId?a.st.startSlideId>
a.numSlides-1&&(a.st.startSlideId=a.numSlides-1):a.st.startSlideId=0;a._o=a.staticSlideId=a.currSlideId=a._u=a.st.startSlideId;a.currSlide=a.slides[a.currSlideId];a._v=0;a.pointerMultitouch=!1;a.slider.addClass((a._h?"rsHor":"rsVer")+(a._l?"":" rsFade"));d='<div class="rsOverflow"><div class="rsContainer">';a.slidesSpacing=a.st.slidesSpacing;a._w=(a._h?a.slider.width():a.slider.height())+a.st.slidesSpacing;a._x=Boolean(0<a._y);1>=a.numSlides&&(a._z=!1);a._a1=a._z&&a._l?2===a.numSlides?1:2:0;a._b1=
6>a.numSlides?a.numSlides:6;a._c1=0;a._d1=0;a.slidesJQ=[];for(c=0;c<a.numSlides;c++)a.slidesJQ.push(n('<div style="'+(a._l?"":c!==a.currSlideId?a._n:"z-index:0;")+'" class="rsSlide "></div>'));a._e1=d=n(d+"</div></div>");var m=a.ns,k=function(b,c,d,e,f){a._j1=b+c+m;a._k1=b+d+m;a._l1=b+e+m;f&&(a._m1=b+f+m)};c=e.pointerEnabled;a.pointerEnabled=c||e.msPointerEnabled;a.pointerEnabled?(a.hasTouch=!1,a._n1=.2,a.pointerMultitouch=Boolean(1<e[(c?"m":"msM")+"axTouchPoints"]),c?k("pointer","down","move","up",
"cancel"):k("MSPointer","Down","Move","Up","Cancel")):(a.isIOS?a._j1=a._k1=a._l1=a._m1="":k("mouse","down","move","up"),"ontouchstart"in window||"createTouch"in document?(a.hasTouch=!0,a._j1+=" touchstart"+m,a._k1+=" touchmove"+m,a._l1+=" touchend"+m,a._m1+=" touchcancel"+m,a._n1=.5,a.st.sliderTouch&&(a._f1=!0)):(a.hasTouch=!1,a._n1=.2));a.st.sliderDrag&&(a._f1=!0,h.msie||h.opera?a._g1=a._h1="move":h.mozilla?(a._g1="-moz-grab",a._h1="-moz-grabbing"):h.webkit&&-1!=e.platform.indexOf("Mac")&&(a._g1=
"-webkit-grab",a._h1="-webkit-grabbing"),a._i1());a.slider.html(d);a._o1=a.st.controlsInside?a._e1:a.slider;a._p1=a._e1.children(".rsContainer");a.pointerEnabled&&a._p1.css((c?"":"-ms-")+"touch-action",a._h?"pan-y":"pan-x");a._q1=n('<div class="rsPreloader"></div>');e=a._p1.children(".rsSlide");a._r1=a.slidesJQ[a.currSlideId];a._s1=0;a._e?(a._t1="transition-property",a._u1="transition-duration",a._v1="transition-timing-function",a._w1=a._x1=a._g+"transform",a._f?(h.webkit&&!h.chrome&&a.slider.addClass("rsWebkit3d"),
a._y1="translate3d(",a._z1="px, ",a._a2="px, 0px)"):(a._y1="translate(",a._z1="px, ",a._a2="px)"),a._l?a._p1[a._g+a._t1]=a._g+"transform":(h={},h[a._g+a._t1]="opacity",h[a._g+a._u1]=a.st.transitionSpeed+"ms",h[a._g+a._v1]=a.st.css3easeInOut,e.css(h))):(a._x1="left",a._w1="top");var p;n(window).on("resize"+a.ns,function(){p&&clearTimeout(p);p=setTimeout(function(){a.updateSliderSize()},50)});a.ev.trigger("rsAfterPropsSetup");a.updateSliderSize();a.st.keyboardNavEnabled&&a._b2();a.st.arrowsNavHideOnTouch&&
(a.hasTouch||a.pointerMultitouch)&&(a.st.arrowsNav=!1);a.st.arrowsNav&&(e=a._o1,n('<div class="rsArrow rsArrowLeft"><div class="rsArrowIcn"></div></div><div class="rsArrow rsArrowRight"><div class="rsArrowIcn"></div></div>').appendTo(e),a._c2=e.children(".rsArrowLeft").click(function(b){b.preventDefault();a.prev()}),a._d2=e.children(".rsArrowRight").click(function(b){b.preventDefault();a.next()}),a.st.arrowsNavAutoHide&&!a.hasTouch&&(a._c2.addClass("rsHidden"),a._d2.addClass("rsHidden"),e.one("mousemove.arrowshover",
function(){a._c2.removeClass("rsHidden");a._d2.removeClass("rsHidden")}),e.hover(function(){a._e2||(a._c2.removeClass("rsHidden"),a._d2.removeClass("rsHidden"))},function(){a._e2||(a._c2.addClass("rsHidden"),a._d2.addClass("rsHidden"))})),a.ev.on("rsOnUpdateNav",function(){a._f2()}),a._f2());if(a.hasTouch&&a.st.sliderTouch||!a.hasTouch&&a.st.sliderDrag)a._p1.on(a._j1,function(b){a._g2(b)});else a.dragSuccess=!1;var r=["rsPlayBtnIcon","rsPlayBtn","rsCloseVideoBtn","rsCloseVideoIcn"];a._p1.click(function(b){if(!a.dragSuccess){var c=
n(b.target).attr("class");if(-1!==n.inArray(c,r)&&a.toggleVideo())return!1;if(a.st.navigateByClick&&!a._h2){if(n(b.target).closest(".rsNoDrag",a._r1).length)return!0;a._i2(b)}a.ev.trigger("rsSlideClick",b)}}).on("click.rs","a",function(b){if(a.dragSuccess)return!1;a._h2=!0;setTimeout(function(){a._h2=!1},3)});a.ev.trigger("rsAfterInit")}n.rsModules||(n.rsModules={uid:0});v.prototype={constructor:v,_i2:function(b){b=b[this._h?"pageX":"pageY"]-this._j2;b>=this._q?this.next():0>b&&this.prev()},_t:function(){var b;
b=this.st.numImagesToPreload;if(this._z=this.st.loop)2===this.numSlides?(this._z=!1,this.st.loopRewind=!0):2>this.numSlides&&(this.st.loopRewind=this._z=!1);this._z&&0<b&&(4>=this.numSlides?b=1:this.st.numImagesToPreload>(this.numSlides-1)/2&&(b=Math.floor((this.numSlides-1)/2)));this._y=b},_s:function(b,f){function c(b,c){c?g.images.push(b.attr(c)):g.images.push(b.text());if(h){h=!1;g.caption="src"===c?b.attr("alt"):b.contents();g.image=g.images[0];g.videoURL=b.attr("data-rsVideo");var d=b.attr("data-rsw"),
e=b.attr("data-rsh");"undefined"!==typeof d&&!1!==d&&"undefined"!==typeof e&&!1!==e?(g.iW=parseInt(d,10),g.iH=parseInt(e,10)):a.st.imgWidth&&a.st.imgHeight&&(g.iW=a.st.imgWidth,g.iH=a.st.imgHeight)}}var a=this,e,g={},d,h=!0;b=n(b);a._k2=b;a.ev.trigger("rsBeforeParseNode",[b,g]);if(!g.stopParsing)return b=a._k2,g.id=a._r,g.contentAdded=!1,a._r++,g.images=[],g.isBig=!1,g.hasCover||(b.hasClass("rsImg")?(d=b,e=!0):(d=b.find(".rsImg"),d.length&&(e=!0)),e?(g.bigImage=d.eq(0).attr("data-rsBigImg"),d.each(function(){var a=
n(this);a.is("a")?c(a,"href"):a.is("img")?c(a,"src"):c(a)})):b.is("img")&&(b.addClass("rsImg rsMainSlideImage"),c(b,"src"))),d=b.find(".rsCaption"),d.length&&(g.caption=d.remove()),g.content=b,a.ev.trigger("rsAfterParseNode",[b,g]),f&&a.slides.push(g),0===g.images.length&&(g.isLoaded=!0,g.isRendered=!1,g.isLoading=!1,g.images=null),g},_b2:function(){var b=this,f,c,a=function(a){37===a?b.prev():39===a&&b.next()};b._b.on("keydown"+b.ns,function(e){if(!b.st.keyboardNavEnabled)return!0;if(!(b._l2||(c=
e.keyCode,37!==c&&39!==c||f))){if(document.activeElement&&/(INPUT|SELECT|TEXTAREA)/i.test(document.activeElement.tagName))return!0;b.isFullscreen&&e.preventDefault();a(c);f=setInterval(function(){a(c)},700)}}).on("keyup"+b.ns,function(a){f&&(clearInterval(f),f=null)})},goTo:function(b,f){b!==this.currSlideId&&this._m2(b,this.st.transitionSpeed,!0,!f)},destroy:function(b){this.ev.trigger("rsBeforeDestroy");this._b.off("keydown"+this.ns+" keyup"+this.ns+" "+this._k1+" "+this._l1);this._p1.off(this._j1+
" click");this.slider.data("royalSlider",null);n.removeData(this.slider,"royalSlider");n(window).off("resize"+this.ns);this.loadingTimeout&&clearTimeout(this.loadingTimeout);b&&this.slider.remove();this.ev=this.slider=this.slides=null},_n2:function(b,f){function c(c,f,g){c.isAdded?(a(f,c),e(f,c)):(g||(g=d.slidesJQ[f]),c.holder?g=c.holder:(g=d.slidesJQ[f]=n(g),c.holder=g),c.appendOnLoaded=!1,e(f,c,g),a(f,c),d._p2(c,g,b),c.isAdded=!0)}function a(a,c){c.contentAdded||(d.setItemHtml(c,b),b||(c.contentAdded=
!0))}function e(a,b,c){d._l&&(c||(c=d.slidesJQ[a]),c.css(d._i,(a+d._d1+p)*d._w))}function g(a){if(l){if(a>q-1)return g(a-q);if(0>a)return g(q+a)}return a}var d=this,h,k,l=d._z,q=d.numSlides;if(!isNaN(f))return g(f);var m=d.currSlideId,p,r=b?Math.abs(d._o2-d.currSlideId)>=d.numSlides-1?0:1:d._y,t=Math.min(2,r),w=!1,v=!1,u;for(k=m;k<m+1+t;k++)if(u=g(k),(h=d.slides[u])&&(!h.isAdded||!h.positionSet)){w=!0;break}for(k=m-1;k>m-1-t;k--)if(u=g(k),(h=d.slides[u])&&(!h.isAdded||!h.positionSet)){v=!0;break}if(w)for(k=
m;k<m+r+1;k++)u=g(k),p=Math.floor((d._u-(m-k))/d.numSlides)*d.numSlides,(h=d.slides[u])&&c(h,u);if(v)for(k=m-1;k>m-1-r;k--)u=g(k),p=Math.floor((d._u-(m-k))/q)*q,(h=d.slides[u])&&c(h,u);if(!b)for(t=g(m-r),m=g(m+r),r=t>m?0:t,k=0;k<q;k++)t>m&&k>t-1||!(k<r||k>m)||(h=d.slides[k])&&h.holder&&(h.holder.detach(),h.isAdded=!1)},setItemHtml:function(b,f){var c=this,a=function(){if(!b.images)b.isRendered=!0,b.isLoaded=!0,b.isLoading=!1,d(!0);else if(!b.isLoading){var a,f;b.content.hasClass("rsImg")?(a=b.content,
f=!0):a=b.content.find(".rsImg:not(img)");a&&!a.is("img")&&a.each(function(){var a=n(this),c='<img class="rsImg" src="'+(a.is("a")?a.attr("href"):a.text())+'" />';f?b.content=n(c):a.replaceWith(c)});a=f?b.content:b.content.find("img.rsImg");k();a.eq(0).addClass("rsMainSlideImage");b.iW&&b.iH&&(b.isLoaded||c._q2(b),d());b.isLoading=!0;if(b.isBig)n("<img />").on("load.rs error.rs",function(a){n(this).off("load.rs error.rs");e([this],!0)}).attr("src",b.image);else{b.loaded=[];b.numStartedLoad=0;a=function(a){n(this).off("load.rs error.rs");
b.loaded.push(this);b.loaded.length===b.numStartedLoad&&e(b.loaded,!1)};for(var g=0;g<b.images.length;g++){var h=n("<img />");b.numStartedLoad++;h.on("load.rs error.rs",a).attr("src",b.images[g])}}}},e=function(a,c){if(a.length){var d=a[0];if(c!==b.isBig)(d=b.holder.children())&&1<d.length&&l();else if(b.iW&&b.iH)g();else if(b.iW=d.width,b.iH=d.height,b.iW&&b.iH)g();else{var e=new Image;e.onload=function(){e.width?(b.iW=e.width,b.iH=e.height,g()):setTimeout(function(){e.width&&(b.iW=e.width,b.iH=
e.height);g()},1E3)};e.src=d.src}}else g()},g=function(){b.isLoaded=!0;b.isLoading=!1;d();l();h()},d=function(){if(!b.isAppended&&c.ev){var a=c.st.visibleNearby,d=b.id-c._o;f||b.appendOnLoaded||!c.st.fadeinLoadedSlide||0!==d&&(!(a||c._r2||c._l2)||-1!==d&&1!==d)||(a={visibility:"visible",opacity:0},a[c._g+"transition"]="opacity 400ms ease-in-out",b.content.css(a),setTimeout(function(){b.content.css("opacity",1)},16));b.holder.find(".rsPreloader").length?b.holder.append(b.content):b.holder.html(b.content);
b.isAppended=!0;b.isLoaded&&(c._q2(b),h());b.sizeReady||(b.sizeReady=!0,setTimeout(function(){c.ev.trigger("rsMaybeSizeReady",b)},100))}},h=function(){!b.loadedTriggered&&c.ev&&(b.isLoaded=b.loadedTriggered=!0,b.holder.trigger("rsAfterContentSet"),c.ev.trigger("rsAfterContentSet",b))},k=function(){c.st.usePreloader&&b.holder.html(c._q1.clone())},l=function(a){c.st.usePreloader&&(a=b.holder.find(".rsPreloader"),a.length&&a.remove())};b.isLoaded?d():f?!c._l&&b.images&&b.iW&&b.iH?a():(b.holder.isWaiting=
!0,k(),b.holder.slideId=-99):a()},_p2:function(b,f,c){this._p1.append(b.holder);b.appendOnLoaded=!1},_g2:function(b,f){var c=this,a,e="touchstart"===b.type;c._s2=e;c.ev.trigger("rsDragStart");if(n(b.target).closest(".rsNoDrag",c._r1).length)return c.dragSuccess=!1,!0;!f&&c._r2&&(c._t2=!0,c._u2());c.dragSuccess=!1;if(c._l2)e&&(c._v2=!0);else{e&&(c._v2=!1);c._w2();if(e){var g=b.originalEvent.touches;if(g&&0<g.length)a=g[0],1<g.length&&(c._v2=!0);else return}else b.preventDefault(),a=b,c.pointerEnabled&&
(a=a.originalEvent);c._l2=!0;c._b.on(c._k1,function(a){c._x2(a,f)}).on(c._l1,function(a){c._y2(a,f)});c._z2="";c._a3=!1;c._b3=a.pageX;c._c3=a.pageY;c._d3=c._v=(f?c._e3:c._h)?a.pageX:a.pageY;c._f3=0;c._g3=0;c._h3=f?c._i3:c._p;c._j3=(new Date).getTime();if(e)c._e1.on(c._m1,function(a){c._y2(a,f)})}},_k3:function(b,f){if(this._l3){var c=this._m3,a=b.pageX-this._b3,e=b.pageY-this._c3,g=this._h3+a,d=this._h3+e,h=f?this._e3:this._h,g=h?g:d,d=this._z2;this._a3=!0;this._b3=b.pageX;this._c3=b.pageY;"x"===
d&&0!==a?this._f3=0<a?1:-1:"y"===d&&0!==e&&(this._g3=0<e?1:-1);d=h?this._b3:this._c3;a=h?a:e;f?g>this._n3?g=this._h3+a*this._n1:g<this._o3&&(g=this._h3+a*this._n1):this._z||(0>=this.currSlideId&&0<d-this._d3&&(g=this._h3+a*this._n1),this.currSlideId>=this.numSlides-1&&0>d-this._d3&&(g=this._h3+a*this._n1));this._h3=g;200<c-this._j3&&(this._j3=c,this._v=d);f?this._q3(this._h3):this._l&&this._p3(this._h3)}},_x2:function(b,f){var c=this,a,e="touchmove"===b.type;if(!c._s2||e){if(e){if(c._r3)return;var g=
b.originalEvent.touches;if(g){if(1<g.length)return;a=g[0]}else return}else a=b,c.pointerEnabled&&(a=a.originalEvent);c._a3||(c._e&&(f?c._s3:c._p1).css(c._g+c._u1,"0s"),function h(){c._l2&&(c._t3=requestAnimationFrame(h),c._u3&&c._k3(c._u3,f))}());if(c._l3)b.preventDefault(),c._m3=(new Date).getTime(),c._u3=a;else if(g=f?c._e3:c._h,a=Math.abs(a.pageX-c._b3)-Math.abs(a.pageY-c._c3)-(g?-7:7),7<a){if(g)b.preventDefault(),c._z2="x";else if(e){c._v3(b);return}c._l3=!0}else if(-7>a){if(!g)b.preventDefault(),
c._z2="y";else if(e){c._v3(b);return}c._l3=!0}}},_v3:function(b,f){this._r3=!0;this._a3=this._l2=!1;this._y2(b)},_y2:function(b,f){function c(a){return 100>a?100:500<a?500:a}function a(a,b){if(e._l||f)h=(-e._u-e._d1)*e._w,k=Math.abs(e._p-h),e._c=k/b,a&&(e._c+=250),e._c=c(e._c),e._x3(h,!1)}var e=this,g,d,h,k;g=-1<b.type.indexOf("touch");if(!e._s2||g)if(e._s2=!1,e.ev.trigger("rsDragRelease"),e._u3=null,e._l2=!1,e._r3=!1,e._l3=!1,e._m3=0,cancelAnimationFrame(e._t3),e._a3&&(f?e._q3(e._h3):e._l&&e._p3(e._h3)),
e._b.off(e._k1).off(e._l1),g&&e._e1.off(e._m1),e._i1(),!e._a3&&!e._v2&&f&&e._w3){var l=n(b.target).closest(".rsNavItem");l.length&&e.goTo(l.index())}else{d=f?e._e3:e._h;if(!e._a3||"y"===e._z2&&d||"x"===e._z2&&!d)if(!f&&e._t2){e._t2=!1;if(e.st.navigateByClick){e._i2(e.pointerEnabled?b.originalEvent:b);e.dragSuccess=!0;return}e.dragSuccess=!0}else{e._t2=!1;e.dragSuccess=!1;return}else e.dragSuccess=!0;e._t2=!1;e._z2="";var q=e.st.minSlideOffset;g=g?b.originalEvent.changedTouches[0]:e.pointerEnabled?
b.originalEvent:b;var m=d?g.pageX:g.pageY,p=e._d3;g=e._v;var r=e.currSlideId,t=e.numSlides,w=d?e._f3:e._g3,v=e._z;Math.abs(m-p);g=m-g;d=(new Date).getTime()-e._j3;d=Math.abs(g)/d;if(0===w||1>=t)a(!0,d);else{if(!v&&!f)if(0>=r){if(0<w){a(!0,d);return}}else if(r>=t-1&&0>w){a(!0,d);return}if(f){h=e._i3;if(h>e._n3)h=e._n3;else if(h<e._o3)h=e._o3;else{m=d*d/.006;l=-e._i3;p=e._y3-e._z3+e._i3;0<g&&m>l?(l+=e._z3/(15/(m/d*.003)),d=d*l/m,m=l):0>g&&m>p&&(p+=e._z3/(15/(m/d*.003)),d=d*p/m,m=p);l=Math.max(Math.round(d/
.003),50);h+=m*(0>g?-1:1);if(h>e._n3){e._a4(h,l,!0,e._n3,200);return}if(h<e._o3){e._a4(h,l,!0,e._o3,200);return}}e._a4(h,l,!0)}else l=function(a){var b=Math.floor(a/e._w);a-b*e._w>q&&b++;return b},p+q<m?0>w?a(!1,d):(l=l(m-p),e._m2(e.currSlideId-l,c(Math.abs(e._p-(-e._u-e._d1+l)*e._w)/d),!1,!0,!0)):p-q>m?0<w?a(!1,d):(l=l(p-m),e._m2(e.currSlideId+l,c(Math.abs(e._p-(-e._u-e._d1-l)*e._w)/d),!1,!0,!0)):a(!1,d)}}},_p3:function(b){b=this._p=b;this._e?this._p1.css(this._x1,this._y1+(this._h?b+this._z1+0:
0+this._z1+b)+this._a2):this._p1.css(this._h?this._x1:this._w1,b)},updateSliderSize:function(b){var f,c;if(this.slider){if(this.st.autoScaleSlider){var a=this.st.autoScaleSliderWidth,e=this.st.autoScaleSliderHeight;this.st.autoScaleHeight?(f=this.slider.width(),f!=this.width&&(this.slider.css("height",e/a*f),f=this.slider.width()),c=this.slider.height()):(c=this.slider.height(),c!=this.height&&(this.slider.css("width",a/e*c),c=this.slider.height()),f=this.slider.width())}else f=this.slider.width(),
c=this.slider.height();if(b||f!=this.width||c!=this.height){this.width=f;this.height=c;this._b4=f;this._c4=c;this.ev.trigger("rsBeforeSizeSet");this.ev.trigger("rsAfterSizePropSet");this._e1.css({width:this._b4,height:this._c4});this._w=(this._h?this._b4:this._c4)+this.st.slidesSpacing;this._d4=this.st.imageScalePadding;for(f=0;f<this.slides.length;f++)b=this.slides[f],b.positionSet=!1,b&&b.images&&b.isLoaded&&(b.isRendered=!1,this._q2(b));if(this._e4)for(f=0;f<this._e4.length;f++)b=this._e4[f],b.holder.css(this._i,
(b.id+this._d1)*this._w);this._n2();this._l&&(this._e&&this._p1.css(this._g+"transition-duration","0s"),this._p3((-this._u-this._d1)*this._w));this.ev.trigger("rsOnUpdateNav")}this._j2=this._e1.offset();this._j2=this._j2[this._i]}},appendSlide:function(b,f){var c=this._s(b);if(isNaN(f)||f>this.numSlides)f=this.numSlides;this.slides.splice(f,0,c);this.slidesJQ.splice(f,0,n('<div style="'+(this._l?"position:absolute;":this._n)+'" class="rsSlide"></div>'));f<=this.currSlideId&&this.currSlideId++;this.ev.trigger("rsOnAppendSlide",
[c,f]);this._f4(f);f===this.currSlideId&&this.ev.trigger("rsAfterSlideChange")},removeSlide:function(b){var f=this.slides[b];f&&(f.holder&&f.holder.remove(),b<this.currSlideId&&this.currSlideId--,this.slides.splice(b,1),this.slidesJQ.splice(b,1),this.ev.trigger("rsOnRemoveSlide",[b]),this._f4(b),b===this.currSlideId&&this.ev.trigger("rsAfterSlideChange"))},_f4:function(b){var f=this;b=f.numSlides;b=0>=f._u?0:Math.floor(f._u/b);f.numSlides=f.slides.length;0===f.numSlides?(f.currSlideId=f._d1=f._u=
0,f.currSlide=f._g4=null):f._u=b*f.numSlides+f.currSlideId;for(b=0;b<f.numSlides;b++)f.slides[b].id=b;f.currSlide=f.slides[f.currSlideId];f._r1=f.slidesJQ[f.currSlideId];f.currSlideId>=f.numSlides?f.goTo(f.numSlides-1):0>f.currSlideId&&f.goTo(0);f._t();f._l&&f._p1.css(f._g+f._u1,"0ms");f._h4&&clearTimeout(f._h4);f._h4=setTimeout(function(){f._l&&f._p3((-f._u-f._d1)*f._w);f._n2();f._l||f._r1.css({display:"block",opacity:1})},14);f.ev.trigger("rsOnUpdateNav")},_i1:function(){this._f1&&this._l&&(this._g1?
this._e1.css("cursor",this._g1):(this._e1.removeClass("grabbing-cursor"),this._e1.addClass("grab-cursor")))},_w2:function(){this._f1&&this._l&&(this._h1?this._e1.css("cursor",this._h1):(this._e1.removeClass("grab-cursor"),this._e1.addClass("grabbing-cursor")))},next:function(b){this._m2("next",this.st.transitionSpeed,!0,!b)},prev:function(b){this._m2("prev",this.st.transitionSpeed,!0,!b)},_m2:function(b,f,c,a,e){var g=this,d,h,k;g.ev.trigger("rsBeforeMove",[b,a]);k="next"===b?g.currSlideId+1:"prev"===
b?g.currSlideId-1:b=parseInt(b,10);if(!g._z){if(0>k){g._i4("left",!a);return}if(k>=g.numSlides){g._i4("right",!a);return}}g._r2&&(g._u2(!0),c=!1);h=k-g.currSlideId;k=g._o2=g.currSlideId;var l=g.currSlideId+h;a=g._u;var n;g._z?(l=g._n2(!1,l),a+=h):a=l;g._o=l;g._g4=g.slidesJQ[g.currSlideId];g._u=a;g.currSlideId=g._o;g.currSlide=g.slides[g.currSlideId];g._r1=g.slidesJQ[g.currSlideId];var l=g.st.slidesDiff,m=Boolean(0<h);h=Math.abs(h);var p=Math.floor(k/g._y),r=Math.floor((k+(m?l:-l))/g._y),p=(m?Math.max(p,
r):Math.min(p,r))*g._y+(m?g._y-1:0);p>g.numSlides-1?p=g.numSlides-1:0>p&&(p=0);k=m?p-k:k-p;k>g._y&&(k=g._y);if(h>k+l)for(g._d1+=(h-(k+l))*(m?-1:1),f*=1.4,k=0;k<g.numSlides;k++)g.slides[k].positionSet=!1;g._c=f;g._n2(!0);e||(n=!0);d=(-a-g._d1)*g._w;n?setTimeout(function(){g._j4=!1;g._x3(d,b,!1,c);g.ev.trigger("rsOnUpdateNav")},0):(g._x3(d,b,!1,c),g.ev.trigger("rsOnUpdateNav"))},_f2:function(){this.st.arrowsNav&&(1>=this.numSlides?(this._c2.css("display","none"),this._d2.css("display","none")):(this._c2.css("display",
"block"),this._d2.css("display","block"),this._z||this.st.loopRewind||(0===this.currSlideId?this._c2.addClass("rsArrowDisabled"):this._c2.removeClass("rsArrowDisabled"),this.currSlideId===this.numSlides-1?this._d2.addClass("rsArrowDisabled"):this._d2.removeClass("rsArrowDisabled"))))},_x3:function(b,f,c,a,e){function g(){var a;h&&(a=h.data("rsTimeout"))&&(h!==k&&h.css({opacity:0,display:"none",zIndex:0}),clearTimeout(a),h.data("rsTimeout",""));if(a=k.data("rsTimeout"))clearTimeout(a),k.data("rsTimeout",
"")}var d=this,h,k,l={};isNaN(d._c)&&(d._c=400);d._p=d._h3=b;d.ev.trigger("rsBeforeAnimStart");d._e?d._l?(d._c=parseInt(d._c,10),c=d._g+d._v1,l[d._g+d._u1]=d._c+"ms",l[c]=a?n.rsCSS3Easing[d.st.easeInOut]:n.rsCSS3Easing[d.st.easeOut],d._p1.css(l),a||!d.hasTouch?setTimeout(function(){d._p3(b)},5):d._p3(b)):(d._c=d.st.transitionSpeed,h=d._g4,k=d._r1,k.data("rsTimeout")&&k.css("opacity",0),g(),h&&h.data("rsTimeout",setTimeout(function(){l[d._g+d._u1]="0ms";l.zIndex=0;l.display="none";h.data("rsTimeout",
"");h.css(l);setTimeout(function(){h.css("opacity",0)},16)},d._c+60)),l.display="block",l.zIndex=d._m,l.opacity=0,l[d._g+d._u1]="0ms",l[d._g+d._v1]=n.rsCSS3Easing[d.st.easeInOut],k.css(l),k.data("rsTimeout",setTimeout(function(){k.css(d._g+d._u1,d._c+"ms");k.data("rsTimeout",setTimeout(function(){k.css("opacity",1);k.data("rsTimeout","")},20))},20))):d._l?(l[d._h?d._x1:d._w1]=b+"px",d._p1.animate(l,d._c,a?d.st.easeInOut:d.st.easeOut)):(h=d._g4,k=d._r1,k.stop(!0,!0).css({opacity:0,display:"block",
zIndex:d._m}),d._c=d.st.transitionSpeed,k.animate({opacity:1},d._c,d.st.easeInOut),g(),h&&h.data("rsTimeout",setTimeout(function(){h.stop(!0,!0).css({opacity:0,display:"none",zIndex:0})},d._c+60)));d._r2=!0;d.loadingTimeout&&clearTimeout(d.loadingTimeout);d.loadingTimeout=e?setTimeout(function(){d.loadingTimeout=null;e.call()},d._c+60):setTimeout(function(){d.loadingTimeout=null;d._k4(f)},d._c+60)},_u2:function(b){this._r2=!1;clearTimeout(this.loadingTimeout);if(this._l)if(!this._e)this._p1.stop(!0),
this._p=parseInt(this._p1.css(this._h?this._x1:this._w1),10);else{if(!b){b=this._p;var f=this._h3=this._l4();this._p1.css(this._g+this._u1,"0ms");b!==f&&this._p3(f)}}else 20<this._m?this._m=10:this._m++},_l4:function(){var b=window.getComputedStyle(this._p1.get(0),null).getPropertyValue(this._g+"transform").replace(/^matrix\(/i,"").split(/, |\)$/g),f=0===b[0].indexOf("matrix3d");return parseInt(b[this._h?f?12:4:f?13:5],10)},_m4:function(b,f){return this._e?this._y1+(f?b+this._z1+0:0+this._z1+b)+this._a2:
b},_k4:function(b){this._l||(this._r1.css("z-index",0),this._m=10);this._r2=!1;this.staticSlideId=this.currSlideId;this._n2();this._n4=!1;this.ev.trigger("rsAfterSlideChange")},_i4:function(b,f){var c=this,a=(-c._u-c._d1)*c._w;if(0!==c.numSlides&&!c._r2)if(c.st.loopRewind)c.goTo("left"===b?c.numSlides-1:0,f);else if(c._l){c._c=200;var e=function(){c._r2=!1};c._x3(a+("left"===b?30:-30),"",!1,!0,function(){c._r2=!1;c._x3(a,"",!1,!0,e)})}},_q2:function(b,f){if(!b.isRendered){var c=b.content,a="rsMainSlideImage",
e,g=n.isFunction(this.st.imageAlignCenter)?this.st.imageAlignCenter(b):this.st.imageAlignCenter,d=n.isFunction(this.st.imageScaleMode)?this.st.imageScaleMode(b):this.st.imageScaleMode,h;b.videoURL&&(a="rsVideoContainer","fill"!==d?e=!0:(h=c,h.hasClass(a)||(h=h.find("."+a)),h.css({width:"100%",height:"100%"}),a="rsMainSlideImage"));c.hasClass(a)||(c=c.find("."+a));if(c){var k=b.iW,l=b.iH;b.isRendered=!0;if("none"!==d||g){a="fill"!==d?this._d4:0;h=this._b4-2*a;var q=this._c4-2*a,m,p,r={};"fit-if-smaller"===
d&&(k>h||l>q)&&(d="fit");if("fill"===d||"fit"===d)m=h/k,p=q/l,m="fill"==d?m>p?m:p:"fit"==d?m<p?m:p:1,k=Math.ceil(k*m,10),l=Math.ceil(l*m,10);"none"!==d&&(r.width=k,r.height=l,e&&c.find(".rsImg").css({width:"100%",height:"100%"}));g&&(r.marginLeft=Math.floor((h-k)/2)+a,r.marginTop=Math.floor((q-l)/2)+a);c.css(r)}}}}};n.rsProto=v.prototype;n.fn.royalSlider=function(b){var f=arguments;return this.each(function(){var c=n(this);if("object"!==typeof b&&b){if((c=c.data("royalSlider"))&&c[b])return c[b].apply(c,
Array.prototype.slice.call(f,1))}else c.data("royalSlider")||c.data("royalSlider",new v(c,b))})};n.fn.royalSlider.defaults={slidesSpacing:8,startSlideId:0,loop:!1,loopRewind:!1,numImagesToPreload:4,fadeinLoadedSlide:!0,slidesOrientation:"horizontal",transitionType:"move",transitionSpeed:600,controlNavigation:"bullets",controlsInside:!0,arrowsNav:!0,arrowsNavAutoHide:!0,navigateByClick:!0,randomizeSlides:!1,sliderDrag:!0,sliderTouch:!0,keyboardNavEnabled:!1,fadeInAfterLoaded:!0,allowCSS3:!0,allowCSS3OnWebkit:!0,
addActiveClass:!1,autoHeight:!1,easeOut:"easeOutSine",easeInOut:"easeInOutSine",minSlideOffset:10,imageScaleMode:"fit-if-smaller",imageAlignCenter:!0,imageScalePadding:4,usePreloader:!0,autoScaleSlider:!1,autoScaleSliderWidth:800,autoScaleSliderHeight:400,autoScaleHeight:!0,arrowsNavHideOnTouch:!1,globalCaption:!1,slidesDiff:2};n.rsCSS3Easing={easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)"};n.extend(jQuery.easing,{easeInOutSine:function(b,
f,c,a,e){return-a/2*(Math.cos(Math.PI*f/e)-1)+c},easeOutSine:function(b,f,c,a,e){return a*Math.sin(f/e*(Math.PI/2))+c},easeOutCubic:function(b,f,c,a,e){return a*((f=f/e-1)*f*f+1)+c}})})(jQuery,window);
// jquery.rs.bullets v1.0.1
(function(c){c.extend(c.rsProto,{_i5:function(){var a=this;"bullets"===a.st.controlNavigation&&(a.ev.one("rsAfterPropsSetup",function(){a._j5=!0;a.slider.addClass("rsWithBullets");for(var b='<div class="rsNav rsBullets">',e=0;e<a.numSlides;e++)b+='<div class="rsNavItem rsBullet"><span></span></div>';a._k5=b=c(b+"</div>");a._l5=b.appendTo(a.slider).children();a._k5.on("click.rs",".rsNavItem",function(b){a._m5||a.goTo(c(this).index())})}),a.ev.on("rsOnAppendSlide",function(b,c,d){d>=a.numSlides?a._k5.append('<div class="rsNavItem rsBullet"><span></span></div>'):
a._l5.eq(d).before('<div class="rsNavItem rsBullet"><span></span></div>');a._l5=a._k5.children()}),a.ev.on("rsOnRemoveSlide",function(b,c){var d=a._l5.eq(c);d&&d.length&&(d.remove(),a._l5=a._k5.children())}),a.ev.on("rsOnUpdateNav",function(){var b=a.currSlideId;a._n5&&a._n5.removeClass("rsNavSelected");b=a._l5.eq(b);b.addClass("rsNavSelected");a._n5=b}))}});c.rsModules.bullets=c.rsProto._i5})(jQuery);
// jquery.rs.thumbnails v1.0.8
(function(f){f.extend(f.rsProto,{_h6:function(){var a=this;"thumbnails"===a.st.controlNavigation&&(a._i6={drag:!0,touch:!0,orientation:"horizontal",navigation:!0,arrows:!0,arrowLeft:null,arrowRight:null,spacing:4,arrowsAutoHide:!1,appendSpan:!1,transitionSpeed:600,autoCenter:!0,fitInViewport:!0,firstMargin:!0,paddingTop:0,paddingBottom:0},a.st.thumbs=f.extend({},a._i6,a.st.thumbs),a._j6=!0,!1===a.st.thumbs.firstMargin?a.st.thumbs.firstMargin=0:!0===a.st.thumbs.firstMargin&&(a.st.thumbs.firstMargin=
a.st.thumbs.spacing),a.ev.on("rsBeforeParseNode",function(a,b,c){b=f(b);c.thumbnail=b.find(".rsTmb").remove();c.thumbnail.length?c.thumbnail=f(document.createElement("div")).append(c.thumbnail).html():(c.thumbnail=b.attr("data-rsTmb"),c.thumbnail||(c.thumbnail=b.find(".rsImg").attr("data-rsTmb")),c.thumbnail=c.thumbnail?'<img src="'+c.thumbnail+'"/>':"")}),a.ev.one("rsAfterPropsSetup",function(){a._k6()}),a._n5=null,a.ev.on("rsOnUpdateNav",function(){var e=f(a._l5[a.currSlideId]);e!==a._n5&&(a._n5&&
(a._n5.removeClass("rsNavSelected"),a._n5=null),a._l6&&a._m6(a.currSlideId),a._n5=e.addClass("rsNavSelected"))}),a.ev.on("rsOnAppendSlide",function(e,b,c){e="<div"+a._n6+' class="rsNavItem rsThumb">'+a._o6+b.thumbnail+"</div>";a._e&&a._s3.css(a._g+"transition-duration","0ms");c>=a.numSlides?a._s3.append(e):a._l5.eq(c).before(e);a._l5=a._s3.children();a.updateThumbsSize(!0)}),a.ev.on("rsOnRemoveSlide",function(e,b){var c=a._l5.eq(b);c&&(a._e&&a._s3.css(a._g+"transition-duration","0ms"),c.remove(),
a._l5=a._s3.children(),a.updateThumbsSize(!0))}))},_k6:function(){var a=this,e="rsThumbs",b=a.st.thumbs,c="",g,d,h=b.spacing;a._j5=!0;a._e3="vertical"===b.orientation?!1:!0;a._n6=g=h?' style="margin-'+(a._e3?"right":"bottom")+":"+h+'px;"':"";a._i3=0;a._p6=!1;a._m5=!1;a._l6=!1;a._q6=b.arrows&&b.navigation;d=a._e3?"Hor":"Ver";a.slider.addClass("rsWithThumbs rsWithThumbs"+d);c+='<div class="rsNav rsThumbs rsThumbs'+d+'"><div class="'+e+'Container">';a._o6=b.appendSpan?'<span class="thumbIco"></span>':
"";for(var k=0;k<a.numSlides;k++)d=a.slides[k],c+="<div"+g+' class="rsNavItem rsThumb">'+d.thumbnail+a._o6+"</div>";c=f(c+"</div></div>");g={};b.paddingTop&&(g[a._e3?"paddingTop":"paddingLeft"]=b.paddingTop);b.paddingBottom&&(g[a._e3?"paddingBottom":"paddingRight"]=b.paddingBottom);c.css(g);a._s3=f(c).find("."+e+"Container");a._q6&&(e+="Arrow",b.arrowLeft?a._r6=b.arrowLeft:(a._r6=f('<div class="'+e+" "+e+'Left"><div class="'+e+'Icn"></div></div>'),c.append(a._r6)),b.arrowRight?a._s6=b.arrowRight:
(a._s6=f('<div class="'+e+" "+e+'Right"><div class="'+e+'Icn"></div></div>'),c.append(a._s6)),a._r6.click(function(){var b=(Math.floor(a._i3/a._t6)+a._u6)*a._t6+a.st.thumbs.firstMargin;a._a4(b>a._n3?a._n3:b)}),a._s6.click(function(){var b=(Math.floor(a._i3/a._t6)-a._u6)*a._t6+a.st.thumbs.firstMargin;a._a4(b<a._o3?a._o3:b)}),b.arrowsAutoHide&&!a.hasTouch&&(a._r6.css("opacity",0),a._s6.css("opacity",0),c.one("mousemove.rsarrowshover",function(){a._l6&&(a._r6.css("opacity",1),a._s6.css("opacity",1))}),
c.hover(function(){a._l6&&(a._r6.css("opacity",1),a._s6.css("opacity",1))},function(){a._l6&&(a._r6.css("opacity",0),a._s6.css("opacity",0))})));a._k5=c;a._l5=a._s3.children();a.msEnabled&&a.st.thumbs.navigation&&a._s3.css("-ms-touch-action",a._e3?"pan-y":"pan-x");a.slider.append(c);a._w3=!0;a._v6=h;b.navigation&&a._e&&a._s3.css(a._g+"transition-property",a._g+"transform");a._k5.on("click.rs",".rsNavItem",function(b){a._m5||a.goTo(f(this).index())});a.ev.off("rsBeforeSizeSet.thumbs").on("rsBeforeSizeSet.thumbs",
function(){a._w6=a._e3?a._c4:a._b4;a.updateThumbsSize(!0)});a.ev.off("rsAutoHeightChange.thumbs").on("rsAutoHeightChange.thumbs",function(b,c){a.updateThumbsSize(!0,c)})},updateThumbsSize:function(a,e){var b=this,c=b._l5.first(),f={},d=b._l5.length;b._t6=(b._e3?c.outerWidth():c.outerHeight())+b._v6;b._y3=d*b._t6-b._v6;f[b._e3?"width":"height"]=b._y3+b._v6;b._z3=b._e3?b._k5.width():void 0!==e?e:b._k5.height();b._w3&&(b.isFullscreen||b.st.thumbs.fitInViewport)&&(b._e3?b._c4=b._w6-b._k5.outerHeight():
b._b4=b._w6-b._k5.outerWidth());b._z3&&(b._o3=-(b._y3-b._z3)-b.st.thumbs.firstMargin,b._n3=b.st.thumbs.firstMargin,b._u6=Math.floor(b._z3/b._t6),b._y3<b._z3?(b.st.thumbs.autoCenter?b._q3((b._z3-b._y3)/2):b._q3(b._n3),b.st.thumbs.arrows&&b._r6&&(b._r6.addClass("rsThumbsArrowDisabled"),b._s6.addClass("rsThumbsArrowDisabled")),b._l6=!1,b._m5=!1,b._k5.off(b._j1)):b.st.thumbs.navigation&&!b._l6&&(b._l6=!0,!b.hasTouch&&b.st.thumbs.drag||b.hasTouch&&b.st.thumbs.touch)&&(b._m5=!0,b._k5.on(b._j1,function(a){b._g2(a,
!0)})),b._s3.css(f),a&&e&&b._m6(b.currSlideId,!0))},setThumbsOrientation:function(a,e){this._w3&&(this.st.thumbs.orientation=a,this._k5.remove(),this.slider.removeClass("rsWithThumbsHor rsWithThumbsVer"),this._k6(),this._k5.off(this._j1),e||this.updateSliderSize(!0))},_q3:function(a){this._i3=a;this._e?this._s3.css(this._x1,this._y1+(this._e3?a+this._z1+0:0+this._z1+a)+this._a2):this._s3.css(this._e3?this._x1:this._w1,a)},_a4:function(a,e,b,c,g){var d=this;if(d._l6){e||(e=d.st.thumbs.transitionSpeed);
d._i3=a;d._x6&&clearTimeout(d._x6);d._p6&&(d._e||d._s3.stop(),b=!0);var h={};d._p6=!0;d._e?(h[d._g+"transition-duration"]=e+"ms",h[d._g+"transition-timing-function"]=b?f.rsCSS3Easing[d.st.easeOut]:f.rsCSS3Easing[d.st.easeInOut],d._s3.css(h),d._q3(a)):(h[d._e3?d._x1:d._w1]=a+"px",d._s3.animate(h,e,b?"easeOutCubic":d.st.easeInOut));c&&(d._i3=c);d._y6();d._x6=setTimeout(function(){d._p6=!1;g&&(d._a4(c,g,!0),g=null)},e)}},_y6:function(){this._q6&&(this._i3===this._n3?this._r6.addClass("rsThumbsArrowDisabled"):
this._r6.removeClass("rsThumbsArrowDisabled"),this._i3===this._o3?this._s6.addClass("rsThumbsArrowDisabled"):this._s6.removeClass("rsThumbsArrowDisabled"))},_m6:function(a,e){var b=0,c,f=a*this._t6+2*this._t6-this._v6+this._n3,d=Math.floor(this._i3/this._t6);this._l6&&(this._j6&&(e=!0,this._j6=!1),f+this._i3>this._z3?(a===this.numSlides-1&&(b=1),d=-a+this._u6-2+b,c=d*this._t6+this._z3%this._t6+this._v6-this._n3):0!==a?(a-1)*this._t6<=-this._i3+this._n3&&a-1<=this.numSlides-this._u6&&(c=(-a+1)*this._t6+
this._n3):c=this._n3,c!==this._i3&&(b=void 0===c?this._i3:c,b>this._n3?this._q3(this._n3):b<this._o3?this._q3(this._o3):void 0!==c&&(e?this._q3(c):this._a4(c))),this._y6())}});f.rsModules.thumbnails=f.rsProto._h6})(jQuery);
// jquery.rs.tabs v1.0.2
(function(e){e.extend(e.rsProto,{_f6:function(){var a=this;"tabs"===a.st.controlNavigation&&(a.ev.on("rsBeforeParseNode",function(a,d,b){d=e(d);b.thumbnail=d.find(".rsTmb").remove();b.thumbnail.length?b.thumbnail=e(document.createElement("div")).append(b.thumbnail).html():(b.thumbnail=d.attr("data-rsTmb"),b.thumbnail||(b.thumbnail=d.find(".rsImg").attr("data-rsTmb")),b.thumbnail=b.thumbnail?'<img src="'+b.thumbnail+'"/>':"")}),a.ev.one("rsAfterPropsSetup",function(){a._g6()}),a.ev.on("rsOnAppendSlide",
function(c,d,b){b>=a.numSlides?a._k5.append('<div class="rsNavItem rsTab">'+d.thumbnail+"</div>"):a._l5.eq(b).before('<div class="rsNavItem rsTab">'+item.thumbnail+"</div>");a._l5=a._k5.children()}),a.ev.on("rsOnRemoveSlide",function(c,d){var b=a._l5.eq(d);b&&(b.remove(),a._l5=a._k5.children())}),a.ev.on("rsOnUpdateNav",function(){var c=a.currSlideId;a._n5&&a._n5.removeClass("rsNavSelected");c=a._l5.eq(c);c.addClass("rsNavSelected");a._n5=c}))},_g6:function(){var a=this,c;a._j5=!0;c='<div class="rsNav rsTabs">';
for(var d=0;d<a.numSlides;d++)c+='<div class="rsNavItem rsTab">'+a.slides[d].thumbnail+"</div>";c=e(c+"</div>");a._k5=c;a._l5=c.children(".rsNavItem");a.slider.append(c);a._k5.click(function(b){b=e(b.target).closest(".rsNavItem");b.length&&a.goTo(b.index())})}});e.rsModules.tabs=e.rsProto._f6})(jQuery);
// jquery.rs.fullscreen v1.0.6
(function(c){c.extend(c.rsProto,{_q5:function(){var a=this;a._r5={enabled:!1,keyboardNav:!0,buttonFS:!0,nativeFS:!1,doubleTap:!0};a.st.fullscreen=c.extend({},a._r5,a.st.fullscreen);if(a.st.fullscreen.enabled)a.ev.one("rsBeforeSizeSet",function(){a._s5()})},_s5:function(){var a=this;a._t5=!a.st.keyboardNavEnabled&&a.st.fullscreen.keyboardNav;if(a.st.fullscreen.nativeFS){var b={supportsFullScreen:!1,isFullScreen:function(){return!1},requestFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",
prefix:""},d=["webkit","moz","o","ms","khtml"];if("undefined"!=typeof document.cancelFullScreen)b.supportsFullScreen=!0;else for(var e=0,f=d.length;e<f;e++)if(b.prefix=d[e],"undefined"!=typeof document[b.prefix+"CancelFullScreen"]){b.supportsFullScreen=!0;break}b.supportsFullScreen?(a.nativeFS=!0,b.fullScreenEventName=b.prefix+"fullscreenchange"+a.ns,b.isFullScreen=function(){switch(this.prefix){case "":return document.fullScreen;case "webkit":return document.webkitIsFullScreen;default:return document[this.prefix+
"FullScreen"]}},b.requestFullScreen=function(a){return""===this.prefix?a.requestFullScreen():a[this.prefix+"RequestFullScreen"]()},b.cancelFullScreen=function(a){return""===this.prefix?document.cancelFullScreen():document[this.prefix+"CancelFullScreen"]()},a._u5=b):a._u5=!1}a.st.fullscreen.buttonFS&&(a._v5=c('<div class="rsFullscreenBtn"><div class="rsFullscreenIcn"></div></div>').appendTo(a._o1).on("click.rs",function(){a.isFullscreen?a.exitFullscreen():a.enterFullscreen()}))},enterFullscreen:function(a){var b=
this;if(b._u5)if(a)b._u5.requestFullScreen(c("html")[0]);else{b._b.on(b._u5.fullScreenEventName,function(a){b._u5.isFullScreen()?b.enterFullscreen(!0):b.exitFullscreen(!0)});b._u5.requestFullScreen(c("html")[0]);return}if(!b._w5){b._w5=!0;b._b.on("keyup"+b.ns+"fullscreen",function(a){27===a.keyCode&&b.exitFullscreen()});b._t5&&b._b2();a=c(window);b._x5=a.scrollTop();b._y5=a.scrollLeft();b._z5=c("html").attr("style");b._a6=c("body").attr("style");b._b6=b.slider.attr("style");c("body, html").css({overflow:"hidden",
height:"100%",width:"100%",margin:"0",padding:"0"});b.slider.addClass("rsFullscreen");var d;for(d=0;d<b.numSlides;d++)a=b.slides[d],a.isRendered=!1,a.bigImage&&(a.isBig=!0,a.isMedLoaded=a.isLoaded,a.isMedLoading=a.isLoading,a.medImage=a.image,a.medIW=a.iW,a.medIH=a.iH,a.slideId=-99,a.bigImage!==a.medImage&&(a.sizeType="big"),a.isLoaded=a.isBigLoaded,a.isLoading=!1,a.image=a.bigImage,a.images[0]=a.bigImage,a.iW=a.bigIW,a.iH=a.bigIH,a.isAppended=a.contentAdded=!1,b._c6(a));b.isFullscreen=!0;b._w5=!1;
b.updateSliderSize();b.ev.trigger("rsEnterFullscreen")}},exitFullscreen:function(a){var b=this;if(b._u5){if(!a){b._u5.cancelFullScreen(c("html")[0]);return}b._b.off(b._u5.fullScreenEventName)}if(!b._w5){b._w5=!0;b._b.off("keyup"+b.ns+"fullscreen");b._t5&&b._b.off("keydown"+b.ns);c("html").attr("style",b._z5||"");c("body").attr("style",b._a6||"");var d;for(d=0;d<b.numSlides;d++)a=b.slides[d],a.isRendered=!1,a.bigImage&&(a.isBig=!1,a.slideId=-99,a.isBigLoaded=a.isLoaded,a.isBigLoading=a.isLoading,a.bigImage=
a.image,a.bigIW=a.iW,a.bigIH=a.iH,a.isLoaded=a.isMedLoaded,a.isLoading=!1,a.image=a.medImage,a.images[0]=a.medImage,a.iW=a.medIW,a.iH=a.medIH,a.isAppended=a.contentAdded=!1,b._c6(a,!0),a.bigImage!==a.medImage&&(a.sizeType="med"));b.isFullscreen=!1;a=c(window);a.scrollTop(b._x5);a.scrollLeft(b._y5);b._w5=!1;b.slider.removeClass("rsFullscreen");b.updateSliderSize();setTimeout(function(){b.updateSliderSize()},1);b.ev.trigger("rsExitFullscreen")}},_c6:function(a,b){var d=a.isLoaded||a.isLoading?'<img class="rsImg rsMainSlideImage" src="'+
a.image+'"/>':'<a class="rsImg rsMainSlideImage" href="'+a.image+'"></a>';a.content.hasClass("rsImg")?a.content=c(d):a.content.find(".rsImg").eq(0).replaceWith(d);a.isLoaded||a.isLoading||!a.holder||a.holder.html(a.content)}});c.rsModules.fullscreen=c.rsProto._q5})(jQuery);
// jquery.rs.autoplay v1.0.5
(function(b){b.extend(b.rsProto,{_x4:function(){var a=this,d;a._y4={enabled:!1,stopAtAction:!0,pauseOnHover:!0,delay:2E3};!a.st.autoPlay&&a.st.autoplay&&(a.st.autoPlay=a.st.autoplay);a.st.autoPlay=b.extend({},a._y4,a.st.autoPlay);a.st.autoPlay.enabled&&(a.ev.on("rsBeforeParseNode",function(a,c,f){c=b(c);if(d=c.attr("data-rsDelay"))f.customDelay=parseInt(d,10)}),a.ev.one("rsAfterInit",function(){a._z4()}),a.ev.on("rsBeforeDestroy",function(){a.stopAutoPlay();a.slider.off("mouseenter mouseleave");b(window).off("blur"+
a.ns+" focus"+a.ns)}))},_z4:function(){var a=this;a.startAutoPlay();a.ev.on("rsAfterContentSet",function(b,e){a._l2||a._r2||!a._a5||e!==a.currSlide||a._b5()});a.ev.on("rsDragRelease",function(){a._a5&&a._c5&&(a._c5=!1,a._b5())});a.ev.on("rsAfterSlideChange",function(){a._a5&&a._c5&&(a._c5=!1,a.currSlide.isLoaded&&a._b5())});a.ev.on("rsDragStart",function(){a._a5&&(a.st.autoPlay.stopAtAction?a.stopAutoPlay():(a._c5=!0,a._d5()))});a.ev.on("rsBeforeMove",function(b,e,c){a._a5&&(c&&a.st.autoPlay.stopAtAction?
a.stopAutoPlay():(a._c5=!0,a._d5()))});a._e5=!1;a.ev.on("rsVideoStop",function(){a._a5&&(a._e5=!1,a._b5())});a.ev.on("rsVideoPlay",function(){a._a5&&(a._c5=!1,a._d5(),a._e5=!0)});b(window).on("blur"+a.ns,function(){a._a5&&(a._c5=!0,a._d5())}).on("focus"+a.ns,function(){a._a5&&a._c5&&(a._c5=!1,a._b5())});a.st.autoPlay.pauseOnHover&&(a._f5=!1,a.slider.hover(function(){a._a5&&(a._c5=!1,a._d5(),a._f5=!0)},function(){a._a5&&(a._f5=!1,a._b5())}))},toggleAutoPlay:function(){this._a5?this.stopAutoPlay():
this.startAutoPlay()},startAutoPlay:function(){this._a5=!0;this.currSlide.isLoaded&&this._b5()},stopAutoPlay:function(){this._e5=this._f5=this._c5=this._a5=!1;this._d5()},_b5:function(){var a=this;a._f5||a._e5||(a._g5=!0,a._h5&&clearTimeout(a._h5),a._h5=setTimeout(function(){var b;a._z||a.st.loopRewind||(b=!0,a.st.loopRewind=!0);a.next(!0);b&&(a.st.loopRewind=!1)},a.currSlide.customDelay?a.currSlide.customDelay:a.st.autoPlay.delay))},_d5:function(){this._f5||this._e5||(this._g5=!1,this._h5&&(clearTimeout(this._h5),
this._h5=null))}});b.rsModules.autoplay=b.rsProto._x4})(jQuery);
// jquery.rs.video v1.1.3
(function(f){f.extend(f.rsProto,{_z6:function(){var a=this;a._a7={autoHideArrows:!0,autoHideControlNav:!1,autoHideBlocks:!1,autoHideCaption:!1,disableCSS3inFF:!0,youTubeCode:'<iframe src="https://www.youtube.com/embed/%id%?rel=1&showinfo=0&autoplay=1&wmode=transparent" frameborder="no"></iframe>',vimeoCode:'<iframe src="https://player.vimeo.com/video/%id%?byline=0&portrait=0&autoplay=1" frameborder="no" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'};a.st.video=f.extend({},a._a7,
a.st.video);a.ev.on("rsBeforeSizeSet",function(){a._b7&&setTimeout(function(){var b=a._r1,b=b.hasClass("rsVideoContainer")?b:b.find(".rsVideoContainer");a._c7&&a._c7.css({width:b.width(),height:b.height()})},32)});var d=a._a.mozilla;a.ev.on("rsAfterParseNode",function(b,c,e){b=f(c);if(e.videoURL){a.st.video.disableCSS3inFF&&d&&(a._e=a._f=!1);c=f('<div class="rsVideoContainer"></div>');var g=f('<div class="rsBtnCenterer"><div class="rsPlayBtn"><div class="rsPlayBtnIcon"></div></div></div>');b.hasClass("rsImg")?
e.content=c.append(b).append(g):e.content.find(".rsImg").wrap(c).after(g)}});a.ev.on("rsAfterSlideChange",function(){a.stopVideo()})},toggleVideo:function(){return this._b7?this.stopVideo():this.playVideo()},playVideo:function(){var a=this;if(!a._b7){var d=a.currSlide;if(!d.videoURL)return!1;a._d7=d;var b=a._e7=d.content,d=d.videoURL,c,e;d.match(/youtu\.be/i)||d.match(/youtube\.com/i)?(e=/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,(e=d.match(e))&&11==e[2].length&&
(c=e[2]),void 0!==c&&(a._c7=a.st.video.youTubeCode.replace("%id%",c))):d.match(/vimeo\.com/i)&&(e=/(www\.)?vimeo.com\/(\d+)($|\/)/,(e=d.match(e))&&(c=e[2]),void 0!==c&&(a._c7=a.st.video.vimeoCode.replace("%id%",c)));a.videoObj=f(a._c7);a.ev.trigger("rsOnCreateVideoElement",[d]);a.videoObj.length&&(a._c7=f('<div class="rsVideoFrameHolder"><div class="rsPreloader"></div><div class="rsCloseVideoBtn"><div class="rsCloseVideoIcn"></div></div></div>'),a._c7.find(".rsPreloader").after(a.videoObj),b=b.hasClass("rsVideoContainer")?
b:b.find(".rsVideoContainer"),a._c7.css({width:b.width(),height:b.height()}).find(".rsCloseVideoBtn").off("click.rsv").on("click.rsv",function(b){a.stopVideo();b.preventDefault();b.stopPropagation();return!1}),b.append(a._c7),a.isIPAD&&b.addClass("rsIOSVideo"),a._f7(!1),setTimeout(function(){a._c7.addClass("rsVideoActive")},10),a.ev.trigger("rsVideoPlay"),a._b7=!0);return!0}return!1},stopVideo:function(){var a=this;return a._b7?(a.isIPAD&&a.slider.find(".rsCloseVideoBtn").remove(),a._f7(!0),setTimeout(function(){a.ev.trigger("rsOnDestroyVideoElement",
[a.videoObj]);var d=a._c7.find("iframe");if(d.length)try{d.attr("src","")}catch(b){}a._c7.remove();a._c7=null},16),a.ev.trigger("rsVideoStop"),a._b7=!1,!0):!1},_f7:function(a,d){var b=[],c=this.st.video;c.autoHideArrows&&(this._c2&&(b.push(this._c2,this._d2),this._e2=!a),this._v5&&b.push(this._v5));c.autoHideControlNav&&this._k5&&b.push(this._k5);c.autoHideBlocks&&this._d7.animBlocks&&b.push(this._d7.animBlocks);c.autoHideCaption&&this.globalCaption&&b.push(this.globalCaption);this.slider[a?"removeClass":
"addClass"]("rsVideoPlaying");if(b.length)for(c=0;c<b.length;c++)a?b[c].removeClass("rsHidden"):b[c].addClass("rsHidden")}});f.rsModules.video=f.rsProto._z6})(jQuery);// jquery.rs.animated-blocks v1.0.7
(function(l){l.extend(l.rsProto,{_p4:function(){function m(){var g=a.currSlide;if(a.currSlide&&a.currSlide.isLoaded&&a._t4!==g){if(0<a._s4.length){for(b=0;b<a._s4.length;b++)clearTimeout(a._s4[b]);a._s4=[]}if(0<a._r4.length){var f;for(b=0;b<a._r4.length;b++)if(f=a._r4[b])a._e?(f.block.css(a._g+a._u1,"0s"),f.block.css(f.css)):f.block.stop(!0).css(f.css),a._t4=null,g.animBlocksDisplayed=!1;a._r4=[]}g.animBlocks&&(g.animBlocksDisplayed=!0,a._t4=g,a._u4(g.animBlocks))}}var a=this,b;a._q4={fadeEffect:!0,
moveEffect:"top",moveOffset:20,speed:400,easing:"easeOutSine",delay:200};a.st.block=l.extend({},a._q4,a.st.block);a._r4=[];a._s4=[];a.ev.on("rsAfterInit",function(){m()});a.ev.on("rsBeforeParseNode",function(a,b,d){b=l(b);d.animBlocks=b.find(".rsABlock").css("display","none");d.animBlocks.length||(b.hasClass("rsABlock")?d.animBlocks=b.css("display","none"):d.animBlocks=!1)});a.ev.on("rsAfterContentSet",function(b,f){f.id===a.slides[a.currSlideId].id&&setTimeout(function(){m()},a.st.fadeinLoadedSlide?
300:0)});a.ev.on("rsAfterSlideChange",function(){m()})},_v4:function(l,a){setTimeout(function(){l.css(a)},6)},_u4:function(m){var a=this,b,g,f,d,h,e,n;a._s4=[];m.each(function(m){b=l(this);g={};f={};d=null;var c=b.attr("data-move-offset"),c=c?parseInt(c,10):a.st.block.moveOffset;if(0<c&&((e=b.data("move-effect"))?(e=e.toLowerCase(),"none"===e?e=!1:"left"!==e&&"top"!==e&&"bottom"!==e&&"right"!==e&&(e=a.st.block.moveEffect,"none"===e&&(e=!1))):e=a.st.block.moveEffect,e&&"none"!==e)){var p;p="right"===
e||"left"===e?!0:!1;var k;n=!1;a._e?(k=0,h=a._x1):(p?isNaN(parseInt(b.css("right"),10))?h="left":(h="right",n=!0):isNaN(parseInt(b.css("bottom"),10))?h="top":(h="bottom",n=!0),h="margin-"+h,n&&(c=-c),a._e?k=parseInt(b.css(h),10):(k=b.data("rs-start-move-prop"),void 0===k&&(k=parseInt(b.css(h),10),isNaN(k)&&(k=0),b.data("rs-start-move-prop",k))));f[h]=a._m4("top"===e||"left"===e?k-c:k+c,p);g[h]=a._m4(k,p)}c=b.attr("data-fade-effect");if(!c)c=a.st.block.fadeEffect;else if("none"===c.toLowerCase()||
"false"===c.toLowerCase())c=!1;c&&(f.opacity=0,g.opacity=1);if(c||e)d={},d.hasFade=Boolean(c),Boolean(e)&&(d.moveProp=h,d.hasMove=!0),d.speed=b.data("speed"),isNaN(d.speed)&&(d.speed=a.st.block.speed),d.easing=b.data("easing"),d.easing||(d.easing=a.st.block.easing),d.css3Easing=l.rsCSS3Easing[d.easing],d.delay=b.data("delay"),isNaN(d.delay)&&(d.delay=a.st.block.delay*m);c={};a._e&&(c[a._g+a._u1]="0ms");c.moveProp=g.moveProp;c.opacity=g.opacity;c.display="none";a._r4.push({block:b,css:c});a._v4(b,
f);a._s4.push(setTimeout(function(b,d,c,e){return function(){b.css("display","block");if(c){var g={};if(a._e){var f="";c.hasMove&&(f+=c.moveProp);c.hasFade&&(c.hasMove&&(f+=", "),f+="opacity");g[a._g+a._t1]=f;g[a._g+a._u1]=c.speed+"ms";g[a._g+a._v1]=c.css3Easing;b.css(g);setTimeout(function(){b.css(d)},24)}else setTimeout(function(){b.animate(d,c.speed,c.easing)},16)}delete a._s4[e]}}(b,g,d,m),6>=d.delay?12:d.delay))})}});l.rsModules.animatedBlocks=l.rsProto._p4})(jQuery);
// jquery.rs.auto-height v1.0.3
(function(b){b.extend(b.rsProto,{_w4:function(){var a=this;if(a.st.autoHeight){var b,c,e,f=!0,d=function(d){e=a.slides[a.currSlideId];(b=e.holder)&&(c=b.height())&&void 0!==c&&c>(a.st.minAutoHeight||30)&&(a._c4=c,a._e||!d?a._e1.css("height",c):a._e1.stop(!0,!0).animate({height:c},a.st.transitionSpeed),a.ev.trigger("rsAutoHeightChange",c),f&&(a._e&&setTimeout(function(){a._e1.css(a._g+"transition","height "+a.st.transitionSpeed+"ms ease-in-out")},16),f=!1))};a.ev.on("rsMaybeSizeReady.rsAutoHeight",
function(a,b){e===b&&d()});a.ev.on("rsAfterContentSet.rsAutoHeight",function(a,b){e===b&&d()});a.slider.addClass("rsAutoHeight");a.ev.one("rsAfterInit",function(){setTimeout(function(){d(!1);setTimeout(function(){a.slider.append('<div style="clear:both; float: none;"></div>')},16)},16)});a.ev.on("rsBeforeAnimStart",function(){d(!0)});a.ev.on("rsBeforeSizeSet",function(){setTimeout(function(){d(!1)},16)})}}});b.rsModules.autoHeight=b.rsProto._w4})(jQuery);
// jquery.rs.global-caption v1.0.1
(function(b){b.extend(b.rsProto,{_d6:function(){var a=this;a.st.globalCaption&&(a.ev.on("rsAfterInit",function(){a.globalCaption=b('<div class="rsGCaption"></div>').appendTo(a.st.globalCaptionInside?a._e1:a.slider);a.globalCaption.html(a.currSlide.caption||"")}),a.ev.on("rsBeforeAnimStart",function(){a.globalCaption.html(a.currSlide.caption||"")}))}});b.rsModules.globalCaption=b.rsProto._d6})(jQuery);
// jquery.rs.active-class v1.0.1
(function(c){c.rsProto._o4=function(){var b,a=this;if(a.st.addActiveClass)a.ev.on("rsOnUpdateNav",function(){b&&clearTimeout(b);b=setTimeout(function(){a._g4&&a._g4.removeClass("rsActiveSlide");a._r1&&a._r1.addClass("rsActiveSlide");b=null},50)})};c.rsModules.activeClass=c.rsProto._o4})(jQuery);
// jquery.rs.deeplinking v1.0.6 + jQuery hashchange plugin v1.3 Copyright (c) 2010 Ben Alman
(function(b){b.extend(b.rsProto,{_o5:function(){var a=this,h,d,f;a._p5={enabled:!1,change:!1,prefix:""};a.st.deeplinking=b.extend({},a._p5,a.st.deeplinking);if(a.st.deeplinking.enabled){var g=a.st.deeplinking.change,e=a.st.deeplinking.prefix,c="#"+e,k=function(){var a=window.location.hash;return a&&0<a.indexOf(e)&&(a=parseInt(a.substring(c.length),10),0<=a)?a-1:-1},p=k();-1!==p&&(a.st.startSlideId=p);g&&(b(window).on("hashchange"+a.ns,function(b){h||(b=k(),0>b||(b>a.numSlides-1&&(b=a.numSlides-1),
a.goTo(b)))}),a.ev.on("rsBeforeAnimStart",function(){d&&clearTimeout(d);f&&clearTimeout(f)}),a.ev.on("rsAfterSlideChange",function(){d&&clearTimeout(d);f&&clearTimeout(f);f=setTimeout(function(){h=!0;window.location.replace((""+window.location).split("#")[0]+c+(a.currSlideId+1));d=setTimeout(function(){h=!1;d=null},60)},400)}));a.ev.on("rsBeforeDestroy",function(){d=f=null;g&&b(window).off("hashchange"+a.ns)})}}});b.rsModules.deeplinking=b.rsProto._o5})(jQuery);
(function(b,a,h){function d(a){a=a||location.href;return"#"+a.replace(/^[^#]*#?(.*)$/,"$1")}"$:nomunge";var f=document,g,e=b.event.special,c=f.documentMode,k="onhashchange"in a&&(c===h||7<c);b.fn.hashchange=function(a){return a?this.bind("hashchange",a):this.trigger("hashchange")};b.fn.hashchange.delay=50;e.hashchange=b.extend(e.hashchange,{setup:function(){if(k)return!1;b(g.start)},teardown:function(){if(k)return!1;b(g.stop)}});g=function(){function g(){var f=d(),e=q(l);f!==l?(m(l=f,e),b(a).trigger("hashchange")):
e!==l&&(location.href=location.href.replace(/#.*/,"")+e);c=setTimeout(g,b.fn.hashchange.delay)}var e={},c,l=d(),n=function(a){return a},m=n,q=n;e.start=function(){c||g()};e.stop=function(){c&&clearTimeout(c);c=h};a.attachEvent&&!a.addEventListener&&!k&&function(){var a,c;e.start=function(){a||(c=(c=b.fn.hashchange.src)&&c+d(),a=b('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){c||m(d());g()}).attr("src",c||"javascript:0").insertAfter("body")[0].contentWindow,f.onpropertychange=
function(){try{"title"===event.propertyName&&(a.document.title=f.title)}catch(b){}})};e.stop=n;q=function(){return d(a.location.href)};m=function(c,e){var d=a.document,g=b.fn.hashchange.domain;c!==e&&(d.title=f.title,d.open(),g&&d.write('<script>document.domain="'+g+'"\x3c/script>'),d.close(),a.location.hash=c)}}();return e}()})(jQuery,this);
// jquery.rs.visible-nearby v1.0.2
(function(d){d.rsProto._g7=function(){var a=this;a.st.visibleNearby&&a.st.visibleNearby.enabled&&(a._h7={enabled:!0,centerArea:.6,center:!0,breakpoint:0,breakpointCenterArea:.8,hiddenOverflow:!0,navigateByCenterClick:!1},a.st.visibleNearby=d.extend({},a._h7,a.st.visibleNearby),a.ev.one("rsAfterPropsSetup",function(){a._i7=a._e1.css("overflow","visible").wrap('<div class="rsVisibleNearbyWrap"></div>').parent();a.st.visibleNearby.hiddenOverflow||a._i7.css("overflow","visible");a._o1=a.st.controlsInside?
a._i7:a.slider}),a.ev.on("rsAfterSizePropSet",function(){var b,c=a.st.visibleNearby;b=c.breakpoint&&a.width<c.breakpoint?c.breakpointCenterArea:c.centerArea;a._h?(a._b4*=b,a._i7.css({height:a._c4,width:a._b4/b}),a._d=a._b4*(1-b)/2/b):(a._c4*=b,a._i7.css({height:a._c4/b,width:a._b4}),a._d=a._c4*(1-b)/2/b);c.navigateByCenterClick||(a._q=a._h?a._b4:a._c4);c.center&&a._e1.css("margin-"+(a._h?"left":"top"),a._d)}))};d.rsModules.visibleNearby=d.rsProto._g7})(jQuery);

/*! Magnific Popup - v1.1.0 - 2016-02-20
 * http://dimsemenov.com/plugins/magnific-popup/
 * Copyright (c) 2016 Dmitry Semenov; */
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery || window.Zepto);
    }
}(function($) {

    /*>>core*/
    /**
     *
     * Magnific Popup Core JS file
     *
     */


    /**
     * Private static constants
     */
    var CLOSE_EVENT = 'Close',
        BEFORE_CLOSE_EVENT = 'BeforeClose',
        AFTER_CLOSE_EVENT = 'AfterClose',
        BEFORE_APPEND_EVENT = 'BeforeAppend',
        MARKUP_PARSE_EVENT = 'MarkupParse',
        OPEN_EVENT = 'Open',
        CHANGE_EVENT = 'Change',
        NS = 'mfp',
        EVENT_NS = '.' + NS,
        READY_CLASS = 'mfp-ready',
        REMOVING_CLASS = 'mfp-removing',
        PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


    /**
     * Private vars
     */
    /*jshint -W079 */
    var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
        MagnificPopup = function(){},
        _isJQ = !!(window.jQuery),
        _prevStatus,
        _window = $(window),
        _document,
        _prevContentType,
        _wrapClasses,
        _currPopupType;


    /**
     * Private functions
     */
    var _mfpOn = function(name, f) {
            mfp.ev.on(NS + name + EVENT_NS, f);
        },
        _getEl = function(className, appendTo, html, raw) {
            var el = document.createElement('div');
            el.className = 'mfp-'+className;
            if(html) {
                el.innerHTML = html;
            }
            if(!raw) {
                el = $(el);
                if(appendTo) {
                    el.appendTo(appendTo);
                }
            } else if(appendTo) {
                appendTo.appendChild(el);
            }
            return el;
        },
        _mfpTrigger = function(e, data) {
            mfp.ev.triggerHandler(NS + e, data);

            if(mfp.st.callbacks) {
                // converts "mfpEventName" to "eventName" callback and triggers it if it's present
                e = e.charAt(0).toLowerCase() + e.slice(1);
                if(mfp.st.callbacks[e]) {
                    mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
                }
            }
        },
        _getCloseBtn = function(type) {
            if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
                mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
                _currPopupType = type;
            }
            return mfp.currTemplate.closeBtn;
        },
        // Initialize Magnific Popup only when called at least once
        _checkInstance = function() {
            if(!$.magnificPopup.instance) {
                /*jshint -W020 */
                mfp = new MagnificPopup();
                mfp.init();
                $.magnificPopup.instance = mfp;
            }
        },
        // CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
        supportsTransitions = function() {
            var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
                v = ['ms','O','Moz','Webkit']; // 'v' for vendor

            if( s['transition'] !== undefined ) {
                return true;
            }

            while( v.length ) {
                if( v.pop() + 'Transition' in s ) {
                    return true;
                }
            }

            return false;
        };



    /**
     * Public functions
     */
    MagnificPopup.prototype = {

        constructor: MagnificPopup,

        /**
         * Initializes Magnific Popup plugin.
         * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
         */
        init: function() {
            var appVersion = navigator.appVersion;
            mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
            mfp.isAndroid = (/android/gi).test(appVersion);
            mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
            mfp.supportsTransition = supportsTransitions();

            // We disable fixed positioned lightbox on devices that don't handle it nicely.
            // If you know a better way of detecting this - let me know.
            mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
            _document = $(document);

            mfp.popupsCache = {};
        },

        /**
         * Opens popup
         * @param  data [description]
         */
        open: function(data) {

            var i;

            if(data.isObj === false) {
                // convert jQuery collection to array to avoid conflicts later
                mfp.items = data.items.toArray();

                mfp.index = 0;
                var items = data.items,
                    item;
                for(i = 0; i < items.length; i++) {
                    item = items[i];
                    if(item.parsed) {
                        item = item.el[0];
                    }
                    if(item === data.el[0]) {
                        mfp.index = i;
                        break;
                    }
                }
            } else {
                mfp.items = $.isArray(data.items) ? data.items : [data.items];
                mfp.index = data.index || 0;
            }

            // if popup is already opened - we just update the content
            if(mfp.isOpen) {
                mfp.updateItemHTML();
                return;
            }

            mfp.types = [];
            _wrapClasses = '';
            if(data.mainEl && data.mainEl.length) {
                mfp.ev = data.mainEl.eq(0);
            } else {
                mfp.ev = _document;
            }

            if(data.key) {
                if(!mfp.popupsCache[data.key]) {
                    mfp.popupsCache[data.key] = {};
                }
                mfp.currTemplate = mfp.popupsCache[data.key];
            } else {
                mfp.currTemplate = {};
            }



            mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data );
            mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

            if(mfp.st.modal) {
                mfp.st.closeOnContentClick = false;
                mfp.st.closeOnBgClick = false;
                mfp.st.showCloseBtn = false;
                mfp.st.enableEscapeKey = false;
            }


            // Building markup
            // main containers are created only once
            if(!mfp.bgOverlay) {

                // Dark overlay
                mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
                    mfp.close();
                });

                mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
                    if(mfp._checkIfClose(e.target)) {
                        mfp.close();
                    }
                });

                mfp.container = _getEl('container', mfp.wrap);
            }

            mfp.contentContainer = _getEl('content');
            if(mfp.st.preloader) {
                mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
            }


            // Initializing modules
            var modules = $.magnificPopup.modules;
            for(i = 0; i < modules.length; i++) {
                var n = modules[i];
                n = n.charAt(0).toUpperCase() + n.slice(1);
                mfp['init'+n].call(mfp);
            }
            _mfpTrigger('BeforeOpen');


            if(mfp.st.showCloseBtn) {
                // Close button
                if(!mfp.st.closeBtnInside) {
                    mfp.wrap.append( _getCloseBtn() );
                } else {
                    _mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
                        values.close_replaceWith = _getCloseBtn(item.type);
                    });
                    _wrapClasses += ' mfp-close-btn-in';
                }
            }

            if(mfp.st.alignTop) {
                _wrapClasses += ' mfp-align-top';
            }



            if(mfp.fixedContentPos) {
                mfp.wrap.css({
                    overflow: mfp.st.overflowY,
                    overflowX: 'hidden',
                    overflowY: mfp.st.overflowY
                });
            } else {
                mfp.wrap.css({
                    top: _window.scrollTop(),
                    position: 'absolute'
                });
            }
            if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
                mfp.bgOverlay.css({
                    height: _document.height(),
                    position: 'absolute'
                });
            }



            if(mfp.st.enableEscapeKey) {
                // Close on ESC key
                _document.on('keyup' + EVENT_NS, function(e) {
                    if(e.keyCode === 27) {
                        mfp.close();
                    }
                });
            }

            _window.on('resize' + EVENT_NS, function() {
                mfp.updateSize();
            });


            if(!mfp.st.closeOnContentClick) {
                _wrapClasses += ' mfp-auto-cursor';
            }

            if(_wrapClasses)
                mfp.wrap.addClass(_wrapClasses);


            // this triggers recalculation of layout, so we get it once to not to trigger twice
            var windowHeight = mfp.wH = _window.height();


            var windowStyles = {};

            if( mfp.fixedContentPos ) {
                if(mfp._hasScrollBar(windowHeight)){
                    var s = mfp._getScrollbarSize();
                    if(s) {
                        windowStyles.marginRight = s;
                    }
                }
            }

            if(mfp.fixedContentPos) {
                if(!mfp.isIE7) {
                    windowStyles.overflow = 'hidden';
                } else {
                    // ie7 double-scroll bug
                    $('body, html').css('overflow', 'hidden');
                }
            }



            var classesToadd = mfp.st.mainClass;
            if(mfp.isIE7) {
                classesToadd += ' mfp-ie7';
            }
            if(classesToadd) {
                mfp._addClassToMFP( classesToadd );
            }

            // add content
            mfp.updateItemHTML();

            _mfpTrigger('BuildControls');

            // remove scrollbar, add margin e.t.c
            $('html').css(windowStyles);

            // add everything to DOM
            mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

            // Save last focused element
            mfp._lastFocusedEl = document.activeElement;

            // Wait for next cycle to allow CSS transition
            setTimeout(function() {

                if(mfp.content) {
                    mfp._addClassToMFP(READY_CLASS);
                    mfp._setFocus();
                } else {
                    // if content is not defined (not loaded e.t.c) we add class only for BG
                    mfp.bgOverlay.addClass(READY_CLASS);
                }

                // Trap the focus in popup
                _document.on('focusin' + EVENT_NS, mfp._onFocusIn);

            }, 16);

            mfp.isOpen = true;
            mfp.updateSize(windowHeight);
            _mfpTrigger(OPEN_EVENT);

            return data;
        },

        /**
         * Closes the popup
         */
        close: function() {
            if(!mfp.isOpen) return;
            _mfpTrigger(BEFORE_CLOSE_EVENT);

            mfp.isOpen = false;
            // for CSS3 animation
            if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
                mfp._addClassToMFP(REMOVING_CLASS);
                setTimeout(function() {
                    mfp._close();
                }, mfp.st.removalDelay);
            } else {
                mfp._close();
            }
        },

        /**
         * Helper for close() function
         */
        _close: function() {
            _mfpTrigger(CLOSE_EVENT);

            var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

            mfp.bgOverlay.detach();
            mfp.wrap.detach();
            mfp.container.empty();

            if(mfp.st.mainClass) {
                classesToRemove += mfp.st.mainClass + ' ';
            }

            mfp._removeClassFromMFP(classesToRemove);

            if(mfp.fixedContentPos) {
                var windowStyles = {marginRight: ''};
                if(mfp.isIE7) {
                    $('body, html').css('overflow', '');
                } else {
                    windowStyles.overflow = '';
                }
                $('html').css(windowStyles);
            }

            _document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
            mfp.ev.off(EVENT_NS);

            // clean up DOM elements that aren't removed
            mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
            mfp.bgOverlay.attr('class', 'mfp-bg');
            mfp.container.attr('class', 'mfp-container');

            // remove close button from target element
            if(mfp.st.showCloseBtn &&
                (!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
                if(mfp.currTemplate.closeBtn)
                    mfp.currTemplate.closeBtn.detach();
            }


            if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
                $(mfp._lastFocusedEl).focus(); // put tab focus back
            }
            mfp.currItem = null;
            mfp.content = null;
            mfp.currTemplate = null;
            mfp.prevHeight = 0;

            _mfpTrigger(AFTER_CLOSE_EVENT);
        },

        updateSize: function(winHeight) {

            if(mfp.isIOS) {
                // fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
                var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
                var height = window.innerHeight * zoomLevel;
                mfp.wrap.css('height', height);
                mfp.wH = height;
            } else {
                mfp.wH = winHeight || _window.height();
            }
            // Fixes #84: popup incorrectly positioned with position:relative on body
            if(!mfp.fixedContentPos) {
                mfp.wrap.css('height', mfp.wH);
            }

            _mfpTrigger('Resize');

        },

        /**
         * Set content of popup based on current index
         */
        updateItemHTML: function() {
            var item = mfp.items[mfp.index];

            // Detach and perform modifications
            mfp.contentContainer.detach();

            if(mfp.content)
                mfp.content.detach();

            if(!item.parsed) {
                item = mfp.parseEl( mfp.index );
            }

            var type = item.type;

            _mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
            // BeforeChange event works like so:
            // _mfpOn('BeforeChange', function(e, prevType, newType) { });

            mfp.currItem = item;

            if(!mfp.currTemplate[type]) {
                var markup = mfp.st[type] ? mfp.st[type].markup : false;

                // allows to modify markup
                _mfpTrigger('FirstMarkupParse', markup);

                if(markup) {
                    mfp.currTemplate[type] = $(markup);
                } else {
                    // if there is no markup found we just define that template is parsed
                    mfp.currTemplate[type] = true;
                }
            }

            if(_prevContentType && _prevContentType !== item.type) {
                mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
            }

            var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
            mfp.appendContent(newContent, type);

            item.preloaded = true;

            _mfpTrigger(CHANGE_EVENT, item);
            _prevContentType = item.type;

            // Append container back after its content changed
            mfp.container.prepend(mfp.contentContainer);

            _mfpTrigger('AfterChange');
        },


        /**
         * Set HTML content of popup
         */
        appendContent: function(newContent, type) {
            mfp.content = newContent;

            if(newContent) {
                if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
                    mfp.currTemplate[type] === true) {
                    // if there is no markup, we just append close button element inside
                    if(!mfp.content.find('.mfp-close').length) {
                        mfp.content.append(_getCloseBtn());
                    }
                } else {
                    mfp.content = newContent;
                }
            } else {
                mfp.content = '';
            }

            _mfpTrigger(BEFORE_APPEND_EVENT);
            mfp.container.addClass('mfp-'+type+'-holder');

            mfp.contentContainer.append(mfp.content);
        },


        /**
         * Creates Magnific Popup data object based on given data
         * @param  {int} index Index of item to parse
         */
        parseEl: function(index) {
            var item = mfp.items[index],
                type;

            if(item.tagName) {
                item = { el: $(item) };
            } else {
                type = item.type;
                item = { data: item, src: item.src };
            }

            if(item.el) {
                var types = mfp.types;

                // check for 'mfp-TYPE' class
                for(var i = 0; i < types.length; i++) {
                    if( item.el.hasClass('mfp-'+types[i]) ) {
                        type = types[i];
                        break;
                    }
                }

                item.src = item.el.attr('data-mfp-src');
                if(!item.src) {
                    item.src = item.el.attr('href');
                }
            }

            item.type = type || mfp.st.type || 'inline';
            item.index = index;
            item.parsed = true;
            mfp.items[index] = item;
            _mfpTrigger('ElementParse', item);

            return mfp.items[index];
        },


        /**
         * Initializes single popup or a group of popups
         */
        addGroup: function(el, options) {
            var eHandler = function(e) {
                e.mfpEl = this;
                mfp._openClick(e, el, options);
            };

            if(!options) {
                options = {};
            }

            var eName = 'click.magnificPopup';
            options.mainEl = el;

            if(options.items) {
                options.isObj = true;
                el.off(eName).on(eName, eHandler);
            } else {
                options.isObj = false;
                if(options.delegate) {
                    el.off(eName).on(eName, options.delegate , eHandler);
                } else {
                    options.items = el;
                    el.off(eName).on(eName, eHandler);
                }
            }
        },
        _openClick: function(e, el, options) {
            var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


            if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
                return;
            }

            var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

            if(disableOn) {
                if($.isFunction(disableOn)) {
                    if( !disableOn.call(mfp) ) {
                        return true;
                    }
                } else { // else it's number
                    if( _window.width() < disableOn ) {
                        return true;
                    }
                }
            }

            if(e.type) {
                e.preventDefault();

                // This will prevent popup from closing if element is inside and popup is already opened
                if(mfp.isOpen) {
                    e.stopPropagation();
                }
            }

            options.el = $(e.mfpEl);
            if(options.delegate) {
                options.items = el.find(options.delegate);
            }
            mfp.open(options);
        },


        /**
         * Updates text on preloader
         */
        updateStatus: function(status, text) {

            if(mfp.preloader) {
                if(_prevStatus !== status) {
                    mfp.container.removeClass('mfp-s-'+_prevStatus);
                }

                if(!text && status === 'loading') {
                    text = mfp.st.tLoading;
                }

                var data = {
                    status: status,
                    text: text
                };
                // allows to modify status
                _mfpTrigger('UpdateStatus', data);

                status = data.status;
                text = data.text;

                mfp.preloader.html(text);

                mfp.preloader.find('a').on('click', function(e) {
                    e.stopImmediatePropagation();
                });

                mfp.container.addClass('mfp-s-'+status);
                _prevStatus = status;
            }
        },


        /*
         "Private" helpers that aren't private at all
         */
        // Check to close popup or not
        // "target" is an element that was clicked
        _checkIfClose: function(target) {

            if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
                return;
            }

            var closeOnContent = mfp.st.closeOnContentClick;
            var closeOnBg = mfp.st.closeOnBgClick;

            if(closeOnContent && closeOnBg) {
                return true;
            } else {

                // We close the popup if click is on close button or on preloader. Or if there is no content.
                if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
                    return true;
                }

                // if click is outside the content
                if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
                    if(closeOnBg) {
                        // last check, if the clicked element is in DOM, (in case it's removed onclick)
                        if( $.contains(document, target) ) {
                            return true;
                        }
                    }
                } else if(closeOnContent) {
                    return true;
                }

            }
            return false;
        },
        _addClassToMFP: function(cName) {
            mfp.bgOverlay.addClass(cName);
            mfp.wrap.addClass(cName);
        },
        _removeClassFromMFP: function(cName) {
            this.bgOverlay.removeClass(cName);
            mfp.wrap.removeClass(cName);
        },
        _hasScrollBar: function(winHeight) {
            return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
        },
        _setFocus: function() {
            (mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
        },
        _onFocusIn: function(e) {
            if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
                mfp._setFocus();
                return false;
            }
        },
        _parseMarkup: function(template, values, item) {
            var arr;
            if(item.data) {
                values = $.extend(item.data, values);
            }
            _mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

            $.each(values, function(key, value) {
                if(value === undefined || value === false) {
                    return true;
                }
                arr = key.split('_');
                if(arr.length > 1) {
                    var el = template.find(EVENT_NS + '-'+arr[0]);

                    if(el.length > 0) {
                        var attr = arr[1];
                        if(attr === 'replaceWith') {
                            if(el[0] !== value[0]) {
                                el.replaceWith(value);
                            }
                        } else if(attr === 'img') {
                            if(el.is('img')) {
                                el.attr('src', value);
                            } else {
                                el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
                            }
                        } else {
                            el.attr(arr[1], value);
                        }
                    }

                } else {
                    template.find(EVENT_NS + '-'+key).html(value);
                }
            });
        },

        _getScrollbarSize: function() {
            // thx David
            if(mfp.scrollbarSize === undefined) {
                var scrollDiv = document.createElement("div");
                scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
                document.body.appendChild(scrollDiv);
                mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                document.body.removeChild(scrollDiv);
            }
            return mfp.scrollbarSize;
        }

    }; /* MagnificPopup core prototype end */




    /**
     * Public static functions
     */
    $.magnificPopup = {
        instance: null,
        proto: MagnificPopup.prototype,
        modules: [],

        open: function(options, index) {
            _checkInstance();

            if(!options) {
                options = {};
            } else {
                options = $.extend(true, {}, options);
            }

            options.isObj = true;
            options.index = index || 0;
            return this.instance.open(options);
        },

        close: function() {
            return $.magnificPopup.instance && $.magnificPopup.instance.close();
        },

        registerModule: function(name, module) {
            if(module.options) {
                $.magnificPopup.defaults[name] = module.options;
            }
            $.extend(this.proto, module.proto);
            this.modules.push(name);
        },

        defaults: {

            // Info about options is in docs:
            // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

            disableOn: 0,

            key: null,

            midClick: false,

            mainClass: '',

            preloader: true,

            focus: '', // CSS selector of input to focus after popup is opened

            closeOnContentClick: false,

            closeOnBgClick: true,

            closeBtnInside: true,

            showCloseBtn: true,

            enableEscapeKey: true,

            modal: false,

            alignTop: false,

            removalDelay: 0,

            prependTo: null,

            fixedContentPos: 'auto',

            fixedBgPos: 'auto',

            overflowY: 'auto',

            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

            tClose: 'Close (Esc)',

            tLoading: 'Loading...',

            autoFocusLast: true

        }
    };



    $.fn.magnificPopup = function(options) {
        _checkInstance();

        var jqEl = $(this);

        // We call some API method of first param is a string
        if (typeof options === "string" ) {

            if(options === 'open') {
                var items,
                    itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
                    index = parseInt(arguments[1], 10) || 0;

                if(itemOpts.items) {
                    items = itemOpts.items[index];
                } else {
                    items = jqEl;
                    if(itemOpts.delegate) {
                        items = items.find(itemOpts.delegate);
                    }
                    items = items.eq( index );
                }
                mfp._openClick({mfpEl:items}, jqEl, itemOpts);
            } else {
                if(mfp.isOpen)
                    mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
            }

        } else {
            // clone options obj
            options = $.extend(true, {}, options);

            /*
             * As Zepto doesn't support .data() method for objects
             * and it works only in normal browsers
             * we assign "options" object directly to the DOM element. FTW!
             */
            if(_isJQ) {
                jqEl.data('magnificPopup', options);
            } else {
                jqEl[0].magnificPopup = options;
            }

            mfp.addGroup(jqEl, options);

        }
        return jqEl;
    };

    /*>>core*/

    /*>>inline*/

    var INLINE_NS = 'inline',
        _hiddenClass,
        _inlinePlaceholder,
        _lastInlineElement,
        _putInlineElementsBack = function() {
            if(_lastInlineElement) {
                _inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
                _lastInlineElement = null;
            }
        };

    $.magnificPopup.registerModule(INLINE_NS, {
        options: {
            hiddenClass: 'hide', // will be appended with `mfp-` prefix
            markup: '',
            tNotFound: 'Content not found'
        },
        proto: {

            initInline: function() {
                mfp.types.push(INLINE_NS);

                _mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
                    _putInlineElementsBack();
                });
            },

            getInline: function(item, template) {

                _putInlineElementsBack();

                if(item.src) {
                    var inlineSt = mfp.st.inline,
                        el = $(item.src);

                    if(el.length) {

                        // If target element has parent - we replace it with placeholder and put it back after popup is closed
                        var parent = el[0].parentNode;
                        if(parent && parent.tagName) {
                            if(!_inlinePlaceholder) {
                                _hiddenClass = inlineSt.hiddenClass;
                                _inlinePlaceholder = _getEl(_hiddenClass);
                                _hiddenClass = 'mfp-'+_hiddenClass;
                            }
                            // replace target inline element with placeholder
                            _lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
                        }

                        mfp.updateStatus('ready');
                    } else {
                        mfp.updateStatus('error', inlineSt.tNotFound);
                        el = $('<div>');
                    }

                    item.inlineElement = el;
                    return el;
                }

                mfp.updateStatus('ready');
                mfp._parseMarkup(template, {}, item);
                return template;
            }
        }
    });

    /*>>inline*/





    /*>>zoom*/
    var hasMozTransform,
        getHasMozTransform = function() {
            if(hasMozTransform === undefined) {
                hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
            }
            return hasMozTransform;
        };

    $.magnificPopup.registerModule('zoom', {

        options: {
            enabled: false,
            easing: 'ease-in-out',
            duration: 300,
            opener: function(element) {
                return element.is('img') ? element : element.find('img');
            }
        },

        proto: {

            initZoom: function() {
                var zoomSt = mfp.st.zoom,
                    ns = '.zoom',
                    image;

                if(!zoomSt.enabled || !mfp.supportsTransition) {
                    return;
                }

                var duration = zoomSt.duration,
                    getElToAnimate = function(image) {
                        var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
                            transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
                            cssObj = {
                                position: 'fixed',
                                zIndex: 9999,
                                left: 0,
                                top: 0,
                                '-webkit-backface-visibility': 'hidden'
                            },
                            t = 'transition';

                        cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

                        newImg.css(cssObj);
                        return newImg;
                    },
                    showMainContent = function() {
                        mfp.content.css('visibility', 'visible');
                    },
                    openTimeout,
                    animatedImg;

                _mfpOn('BuildControls'+ns, function() {
                    if(mfp._allowZoom()) {

                        clearTimeout(openTimeout);
                        mfp.content.css('visibility', 'hidden');

                        // Basically, all code below does is clones existing image, puts in on top of the current one and animated it

                        image = mfp._getItemToZoom();

                        if(!image) {
                            showMainContent();
                            return;
                        }

                        animatedImg = getElToAnimate(image);

                        animatedImg.css( mfp._getOffset() );

                        mfp.wrap.append(animatedImg);

                        openTimeout = setTimeout(function() {
                            animatedImg.css( mfp._getOffset( true ) );
                            openTimeout = setTimeout(function() {

                                showMainContent();

                                setTimeout(function() {
                                    animatedImg.remove();
                                    image = animatedImg = null;
                                    _mfpTrigger('ZoomAnimationEnded');
                                }, 16); // avoid blink when switching images

                            }, duration); // this timeout equals animation duration

                        }, 16); // by adding this timeout we avoid short glitch at the beginning of animation


                        // Lots of timeouts...
                    }
                });
                _mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
                    if(mfp._allowZoom()) {

                        clearTimeout(openTimeout);

                        mfp.st.removalDelay = duration;

                        if(!image) {
                            image = mfp._getItemToZoom();
                            if(!image) {
                                return;
                            }
                            animatedImg = getElToAnimate(image);
                        }

                        animatedImg.css( mfp._getOffset(true) );
                        mfp.wrap.append(animatedImg);
                        mfp.content.css('visibility', 'hidden');

                        setTimeout(function() {
                            animatedImg.css( mfp._getOffset() );
                        }, 16);
                    }

                });

                _mfpOn(CLOSE_EVENT+ns, function() {
                    if(mfp._allowZoom()) {
                        showMainContent();
                        if(animatedImg) {
                            animatedImg.remove();
                        }
                        image = null;
                    }
                });
            },

            _allowZoom: function() {
                return mfp.currItem.type === 'image';
            },

            _getItemToZoom: function() {
                if(mfp.currItem.hasSize) {
                    return mfp.currItem.img;
                } else {
                    return false;
                }
            },

            // Get element postion relative to viewport
            _getOffset: function(isLarge) {
                var el;
                if(isLarge) {
                    el = mfp.currItem.img;
                } else {
                    el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
                }

                var offset = el.offset();
                var paddingTop = parseInt(el.css('padding-top'),10);
                var paddingBottom = parseInt(el.css('padding-bottom'),10);
                offset.top -= ( $(window).scrollTop() - paddingTop );


                /*

                 Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

                 */
                var obj = {
                    width: el.width(),
                    // fix Zepto height+padding issue
                    height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
                };

                // I hate to do this, but there is no another option
                if( getHasMozTransform() ) {
                    obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
                } else {
                    obj.left = offset.left;
                    obj.top = offset.top;
                }
                return obj;
            }

        }
    });



    /*>>zoom*/

    /*>>iframe*/

    var IFRAME_NS = 'iframe',
        _emptyPage = '//about:blank',

        _fixIframeBugs = function(isShowing) {
            if(mfp.currTemplate[IFRAME_NS]) {
                var el = mfp.currTemplate[IFRAME_NS].find('iframe');
                if(el.length) {
                    // reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
                    if(!isShowing) {
                        el[0].src = _emptyPage;
                    }

                    // IE8 black screen bug fix
                    if(mfp.isIE8) {
                        el.css('display', isShowing ? 'block' : 'none');
                    }
                }
            }
        };

    $.magnificPopup.registerModule(IFRAME_NS, {

        options: {
            markup: '<div class="mfp-iframe-scaler">'+
            '<div class="mfp-close"></div>'+
            '<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
            '</div>',

            srcAction: 'iframe_src',

            // we don't care and support only one default type of URL by default
            patterns: {
                youtube: {
                    index: 'youtube.com',
                    id: 'v=',
                    src: '//www.youtube.com/embed/%id%?autoplay=1'
                },
                vimeo: {
                    index: 'vimeo.com/',
                    id: '/',
                    src: '//player.vimeo.com/video/%id%?autoplay=1'
                },
                gmaps: {
                    index: '//maps.google.',
                    src: '%id%&output=embed'
                }
            }
        },

        proto: {
            initIframe: function() {
                mfp.types.push(IFRAME_NS);

                _mfpOn('BeforeChange', function(e, prevType, newType) {
                    if(prevType !== newType) {
                        if(prevType === IFRAME_NS) {
                            _fixIframeBugs(); // iframe if removed
                        } else if(newType === IFRAME_NS) {
                            _fixIframeBugs(true); // iframe is showing
                        }
                    }// else {
                    // iframe source is switched, don't do anything
                    //}
                });

                _mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
                    _fixIframeBugs();
                });
            },

            getIframe: function(item, template) {
                var embedSrc = item.src;
                var iframeSt = mfp.st.iframe;

                $.each(iframeSt.patterns, function() {
                    if(embedSrc.indexOf( this.index ) > -1) {
                        if(this.id) {
                            if(typeof this.id === 'string') {
                                embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
                            } else {
                                embedSrc = this.id.call( this, embedSrc );
                            }
                        }
                        embedSrc = this.src.replace('%id%', embedSrc );
                        return false; // break;
                    }
                });

                var dataObj = {};
                if(iframeSt.srcAction) {
                    dataObj[iframeSt.srcAction] = embedSrc;
                }
                mfp._parseMarkup(template, dataObj, item);

                mfp.updateStatus('ready');

                return template;
            }
        }
    });



    /*>>iframe*/




    _checkInstance(); }));
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.moment=t()}(this,function(){"use strict";function e(){return Qe.apply(null,arguments)}function t(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function n(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function s(e){return void 0===e}function i(e){return"number"==typeof e||"[object Number]"===Object.prototype.toString.call(e)}function r(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function a(e,t){var n,s=[];for(n=0;n<e.length;++n)s.push(t(e[n],n));return s}function o(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function u(e,t){for(var n in t)o(t,n)&&(e[n]=t[n]);return o(t,"toString")&&(e.toString=t.toString),o(t,"valueOf")&&(e.valueOf=t.valueOf),e}function l(e,t,n,s){return ge(e,t,n,s,!0).utc()}function d(e){return null==e._pf&&(e._pf={empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],meridiem:null,rfc2822:!1,weekdayMismatch:!1}),e._pf}function h(e){if(null==e._isValid){var t=d(e),n=Xe.call(t.parsedDateParts,function(e){return null!=e}),s=!isNaN(e._d.getTime())&&t.overflow<0&&!t.empty&&!t.invalidMonth&&!t.invalidWeekday&&!t.weekdayMismatch&&!t.nullInput&&!t.invalidFormat&&!t.userInvalidated&&(!t.meridiem||t.meridiem&&n);if(e._strict&&(s=s&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return s;e._isValid=s}return e._isValid}function c(e){var t=l(NaN);return null!=e?u(d(t),e):d(t).userInvalidated=!0,t}function f(e,t){var n,i,r;if(s(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),s(t._i)||(e._i=t._i),s(t._f)||(e._f=t._f),s(t._l)||(e._l=t._l),s(t._strict)||(e._strict=t._strict),s(t._tzm)||(e._tzm=t._tzm),s(t._isUTC)||(e._isUTC=t._isUTC),s(t._offset)||(e._offset=t._offset),s(t._pf)||(e._pf=d(t)),s(t._locale)||(e._locale=t._locale),Ke.length>0)for(n=0;n<Ke.length;n++)s(r=t[i=Ke[n]])||(e[i]=r);return e}function m(t){f(this,t),this._d=new Date(null!=t._d?t._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),!1===et&&(et=!0,e.updateOffset(this),et=!1)}function _(e){return e instanceof m||null!=e&&null!=e._isAMomentObject}function y(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function g(e){var t=+e,n=0;return 0!==t&&isFinite(t)&&(n=y(t)),n}function p(e,t,n){var s,i=Math.min(e.length,t.length),r=Math.abs(e.length-t.length),a=0;for(s=0;s<i;s++)(n&&e[s]!==t[s]||!n&&g(e[s])!==g(t[s]))&&a++;return a+r}function w(t){!1===e.suppressDeprecationWarnings&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+t)}function v(t,n){var s=!0;return u(function(){if(null!=e.deprecationHandler&&e.deprecationHandler(null,t),s){for(var i,r=[],a=0;a<arguments.length;a++){if(i="","object"==typeof arguments[a]){i+="\n["+a+"] ";for(var o in arguments[0])i+=o+": "+arguments[0][o]+", ";i=i.slice(0,-2)}else i=arguments[a];r.push(i)}w(t+"\nArguments: "+Array.prototype.slice.call(r).join("")+"\n"+(new Error).stack),s=!1}return n.apply(this,arguments)},n)}function M(t,n){null!=e.deprecationHandler&&e.deprecationHandler(t,n),tt[t]||(w(n),tt[t]=!0)}function S(e){return e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function D(e,t){var s,i=u({},e);for(s in t)o(t,s)&&(n(e[s])&&n(t[s])?(i[s]={},u(i[s],e[s]),u(i[s],t[s])):null!=t[s]?i[s]=t[s]:delete i[s]);for(s in e)o(e,s)&&!o(t,s)&&n(e[s])&&(i[s]=u({},i[s]));return i}function k(e){null!=e&&this.set(e)}function Y(e,t){var n=e.toLowerCase();st[n]=st[n+"s"]=st[t]=e}function O(e){return"string"==typeof e?st[e]||st[e.toLowerCase()]:void 0}function T(e){var t,n,s={};for(n in e)o(e,n)&&(t=O(n))&&(s[t]=e[n]);return s}function x(e,t){it[e]=t}function b(e,t,n){var s=""+Math.abs(e),i=t-s.length;return(e>=0?n?"+":"":"-")+Math.pow(10,Math.max(0,i)).toString().substr(1)+s}function P(e,t,n,s){var i=s;"string"==typeof s&&(i=function(){return this[s]()}),e&&(ut[e]=i),t&&(ut[t[0]]=function(){return b(i.apply(this,arguments),t[1],t[2])}),n&&(ut[n]=function(){return this.localeData().ordinal(i.apply(this,arguments),e)})}function W(e){return e.match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function H(e,t){return e.isValid()?(t=R(t,e.localeData()),ot[t]=ot[t]||function(e){var t,n,s=e.match(rt);for(t=0,n=s.length;t<n;t++)ut[s[t]]?s[t]=ut[s[t]]:s[t]=W(s[t]);return function(t){var i,r="";for(i=0;i<n;i++)r+=S(s[i])?s[i].call(t,e):s[i];return r}}(t),ot[t](e)):e.localeData().invalidDate()}function R(e,t){function n(e){return t.longDateFormat(e)||e}var s=5;for(at.lastIndex=0;s>=0&&at.test(e);)e=e.replace(at,n),at.lastIndex=0,s-=1;return e}function C(e,t,n){Yt[e]=S(t)?t:function(e,s){return e&&n?n:t}}function F(e,t){return o(Yt,e)?Yt[e](t._strict,t._locale):new RegExp(function(e){return U(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,t,n,s,i){return t||n||s||i}))}(e))}function U(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function L(e,t){var n,s=t;for("string"==typeof e&&(e=[e]),i(t)&&(s=function(e,n){n[t]=g(e)}),n=0;n<e.length;n++)Ot[e[n]]=s}function N(e,t){L(e,function(e,n,s,i){s._w=s._w||{},t(e,s._w,s,i)})}function G(e,t,n){null!=t&&o(Ot,e)&&Ot[e](t,n._a,n,e)}function V(e){return E(e)?366:365}function E(e){return e%4==0&&e%100!=0||e%400==0}function I(t,n){return function(s){return null!=s?(j(this,t,s),e.updateOffset(this,n),this):A(this,t)}}function A(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function j(e,t,n){e.isValid()&&!isNaN(n)&&("FullYear"===t&&E(e.year())&&1===e.month()&&29===e.date()?e._d["set"+(e._isUTC?"UTC":"")+t](n,e.month(),Z(n,e.month())):e._d["set"+(e._isUTC?"UTC":"")+t](n))}function Z(e,t){if(isNaN(e)||isNaN(t))return NaN;var n=function(e,t){return(e%t+t)%t}(t,12);return e+=(t-n)/12,1===n?E(e)?29:28:31-n%7%2}function z(e,t){var n;if(!e.isValid())return e;if("string"==typeof t)if(/^\d+$/.test(t))t=g(t);else if(t=e.localeData().monthsParse(t),!i(t))return e;return n=Math.min(e.date(),Z(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n),e}function $(t){return null!=t?(z(this,t),e.updateOffset(this,!0),this):A(this,"Month")}function q(){function e(e,t){return t.length-e.length}var t,n,s=[],i=[],r=[];for(t=0;t<12;t++)n=l([2e3,t]),s.push(this.monthsShort(n,"")),i.push(this.months(n,"")),r.push(this.months(n,"")),r.push(this.monthsShort(n,""));for(s.sort(e),i.sort(e),r.sort(e),t=0;t<12;t++)s[t]=U(s[t]),i[t]=U(i[t]);for(t=0;t<24;t++)r[t]=U(r[t]);this._monthsRegex=new RegExp("^("+r.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+i.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+s.join("|")+")","i")}function J(e){var t=new Date(Date.UTC.apply(null,arguments));return e<100&&e>=0&&isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e),t}function B(e,t,n){var s=7+t-n;return-((7+J(e,0,s).getUTCDay()-t)%7)+s-1}function Q(e,t,n,s,i){var r,a,o=1+7*(t-1)+(7+n-s)%7+B(e,s,i);return o<=0?a=V(r=e-1)+o:o>V(e)?(r=e+1,a=o-V(e)):(r=e,a=o),{year:r,dayOfYear:a}}function X(e,t,n){var s,i,r=B(e.year(),t,n),a=Math.floor((e.dayOfYear()-r-1)/7)+1;return a<1?s=a+K(i=e.year()-1,t,n):a>K(e.year(),t,n)?(s=a-K(e.year(),t,n),i=e.year()+1):(i=e.year(),s=a),{week:s,year:i}}function K(e,t,n){var s=B(e,t,n),i=B(e+1,t,n);return(V(e)-s+i)/7}function ee(){function e(e,t){return t.length-e.length}var t,n,s,i,r,a=[],o=[],u=[],d=[];for(t=0;t<7;t++)n=l([2e3,1]).day(t),s=this.weekdaysMin(n,""),i=this.weekdaysShort(n,""),r=this.weekdays(n,""),a.push(s),o.push(i),u.push(r),d.push(s),d.push(i),d.push(r);for(a.sort(e),o.sort(e),u.sort(e),d.sort(e),t=0;t<7;t++)o[t]=U(o[t]),u[t]=U(u[t]),d[t]=U(d[t]);this._weekdaysRegex=new RegExp("^("+d.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+u.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+o.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+a.join("|")+")","i")}function te(){return this.hours()%12||12}function ne(e,t){P(e,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)})}function se(e,t){return t._meridiemParse}function ie(e){return e?e.toLowerCase().replace("_","-"):e}function re(e){var t=null;if(!Xt[e]&&"undefined"!=typeof module&&module&&module.exports)try{t=Jt._abbr;require("./locale/"+e),ae(t)}catch(e){}return Xt[e]}function ae(e,t){var n;return e&&(n=s(t)?ue(e):oe(e,t))&&(Jt=n),Jt._abbr}function oe(e,t){if(null!==t){var n=Qt;if(t.abbr=e,null!=Xt[e])M("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),n=Xt[e]._config;else if(null!=t.parentLocale){if(null==Xt[t.parentLocale])return Kt[t.parentLocale]||(Kt[t.parentLocale]=[]),Kt[t.parentLocale].push({name:e,config:t}),null;n=Xt[t.parentLocale]._config}return Xt[e]=new k(D(n,t)),Kt[e]&&Kt[e].forEach(function(e){oe(e.name,e.config)}),ae(e),Xt[e]}return delete Xt[e],null}function ue(e){var n;if(e&&e._locale&&e._locale._abbr&&(e=e._locale._abbr),!e)return Jt;if(!t(e)){if(n=re(e))return n;e=[e]}return function(e){for(var t,n,s,i,r=0;r<e.length;){for(t=(i=ie(e[r]).split("-")).length,n=(n=ie(e[r+1]))?n.split("-"):null;t>0;){if(s=re(i.slice(0,t).join("-")))return s;if(n&&n.length>=t&&p(i,n,!0)>=t-1)break;t--}r++}return null}(e)}function le(e){var t,n=e._a;return n&&-2===d(e).overflow&&(t=n[xt]<0||n[xt]>11?xt:n[bt]<1||n[bt]>Z(n[Tt],n[xt])?bt:n[Pt]<0||n[Pt]>24||24===n[Pt]&&(0!==n[Wt]||0!==n[Ht]||0!==n[Rt])?Pt:n[Wt]<0||n[Wt]>59?Wt:n[Ht]<0||n[Ht]>59?Ht:n[Rt]<0||n[Rt]>999?Rt:-1,d(e)._overflowDayOfYear&&(t<Tt||t>bt)&&(t=bt),d(e)._overflowWeeks&&-1===t&&(t=Ct),d(e)._overflowWeekday&&-1===t&&(t=Ft),d(e).overflow=t),e}function de(e,t,n){return null!=e?e:null!=t?t:n}function he(t){var n,s,i,r,a,o=[];if(!t._d){for(i=function(t){var n=new Date(e.now());return t._useUTC?[n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()]:[n.getFullYear(),n.getMonth(),n.getDate()]}(t),t._w&&null==t._a[bt]&&null==t._a[xt]&&function(e){var t,n,s,i,r,a,o,u;if(null!=(t=e._w).GG||null!=t.W||null!=t.E)r=1,a=4,n=de(t.GG,e._a[Tt],X(pe(),1,4).year),s=de(t.W,1),((i=de(t.E,1))<1||i>7)&&(u=!0);else{r=e._locale._week.dow,a=e._locale._week.doy;var l=X(pe(),r,a);n=de(t.gg,e._a[Tt],l.year),s=de(t.w,l.week),null!=t.d?((i=t.d)<0||i>6)&&(u=!0):null!=t.e?(i=t.e+r,(t.e<0||t.e>6)&&(u=!0)):i=r}s<1||s>K(n,r,a)?d(e)._overflowWeeks=!0:null!=u?d(e)._overflowWeekday=!0:(o=Q(n,s,i,r,a),e._a[Tt]=o.year,e._dayOfYear=o.dayOfYear)}(t),null!=t._dayOfYear&&(a=de(t._a[Tt],i[Tt]),(t._dayOfYear>V(a)||0===t._dayOfYear)&&(d(t)._overflowDayOfYear=!0),s=J(a,0,t._dayOfYear),t._a[xt]=s.getUTCMonth(),t._a[bt]=s.getUTCDate()),n=0;n<3&&null==t._a[n];++n)t._a[n]=o[n]=i[n];for(;n<7;n++)t._a[n]=o[n]=null==t._a[n]?2===n?1:0:t._a[n];24===t._a[Pt]&&0===t._a[Wt]&&0===t._a[Ht]&&0===t._a[Rt]&&(t._nextDay=!0,t._a[Pt]=0),t._d=(t._useUTC?J:function(e,t,n,s,i,r,a){var o=new Date(e,t,n,s,i,r,a);return e<100&&e>=0&&isFinite(o.getFullYear())&&o.setFullYear(e),o}).apply(null,o),r=t._useUTC?t._d.getUTCDay():t._d.getDay(),null!=t._tzm&&t._d.setUTCMinutes(t._d.getUTCMinutes()-t._tzm),t._nextDay&&(t._a[Pt]=24),t._w&&void 0!==t._w.d&&t._w.d!==r&&(d(t).weekdayMismatch=!0)}}function ce(e){var t,n,s,i,r,a,o=e._i,u=en.exec(o)||tn.exec(o);if(u){for(d(e).iso=!0,t=0,n=sn.length;t<n;t++)if(sn[t][1].exec(u[1])){i=sn[t][0],s=!1!==sn[t][2];break}if(null==i)return void(e._isValid=!1);if(u[3]){for(t=0,n=rn.length;t<n;t++)if(rn[t][1].exec(u[3])){r=(u[2]||" ")+rn[t][0];break}if(null==r)return void(e._isValid=!1)}if(!s&&null!=r)return void(e._isValid=!1);if(u[4]){if(!nn.exec(u[4]))return void(e._isValid=!1);a="Z"}e._f=i+(r||"")+(a||""),_e(e)}else e._isValid=!1}function fe(e,t,n,s,i,r){var a=[function(e){var t=parseInt(e,10);{if(t<=49)return 2e3+t;if(t<=999)return 1900+t}return t}(e),Vt.indexOf(t),parseInt(n,10),parseInt(s,10),parseInt(i,10)];return r&&a.push(parseInt(r,10)),a}function me(e){var t=on.exec(function(e){return e.replace(/\([^)]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").trim()}(e._i));if(t){var n=fe(t[4],t[3],t[2],t[5],t[6],t[7]);if(!function(e,t,n){if(e&&jt.indexOf(e)!==new Date(t[0],t[1],t[2]).getDay())return d(n).weekdayMismatch=!0,n._isValid=!1,!1;return!0}(t[1],n,e))return;e._a=n,e._tzm=function(e,t,n){if(e)return un[e];if(t)return 0;var s=parseInt(n,10),i=s%100;return(s-i)/100*60+i}(t[8],t[9],t[10]),e._d=J.apply(null,e._a),e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),d(e).rfc2822=!0}else e._isValid=!1}function _e(t){if(t._f!==e.ISO_8601)if(t._f!==e.RFC_2822){t._a=[],d(t).empty=!0;var n,s,i,r,a,o=""+t._i,u=o.length,l=0;for(i=R(t._f,t._locale).match(rt)||[],n=0;n<i.length;n++)r=i[n],(s=(o.match(F(r,t))||[])[0])&&((a=o.substr(0,o.indexOf(s))).length>0&&d(t).unusedInput.push(a),o=o.slice(o.indexOf(s)+s.length),l+=s.length),ut[r]?(s?d(t).empty=!1:d(t).unusedTokens.push(r),G(r,s,t)):t._strict&&!s&&d(t).unusedTokens.push(r);d(t).charsLeftOver=u-l,o.length>0&&d(t).unusedInput.push(o),t._a[Pt]<=12&&!0===d(t).bigHour&&t._a[Pt]>0&&(d(t).bigHour=void 0),d(t).parsedDateParts=t._a.slice(0),d(t).meridiem=t._meridiem,t._a[Pt]=function(e,t,n){var s;if(null==n)return t;return null!=e.meridiemHour?e.meridiemHour(t,n):null!=e.isPM?((s=e.isPM(n))&&t<12&&(t+=12),s||12!==t||(t=0),t):t}(t._locale,t._a[Pt],t._meridiem),he(t),le(t)}else me(t);else ce(t)}function ye(o){var l=o._i,y=o._f;return o._locale=o._locale||ue(o._l),null===l||void 0===y&&""===l?c({nullInput:!0}):("string"==typeof l&&(o._i=l=o._locale.preparse(l)),_(l)?new m(le(l)):(r(l)?o._d=l:t(y)?function(e){var t,n,s,i,r;if(0===e._f.length)return d(e).invalidFormat=!0,void(e._d=new Date(NaN));for(i=0;i<e._f.length;i++)r=0,t=f({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[i],_e(t),h(t)&&(r+=d(t).charsLeftOver,r+=10*d(t).unusedTokens.length,d(t).score=r,(null==s||r<s)&&(s=r,n=t));u(e,n||t)}(o):y?_e(o):function(o){var u=o._i;s(u)?o._d=new Date(e.now()):r(u)?o._d=new Date(u.valueOf()):"string"==typeof u?function(t){var n=an.exec(t._i);null===n?(ce(t),!1===t._isValid&&(delete t._isValid,me(t),!1===t._isValid&&(delete t._isValid,e.createFromInputFallback(t)))):t._d=new Date(+n[1])}(o):t(u)?(o._a=a(u.slice(0),function(e){return parseInt(e,10)}),he(o)):n(u)?function(e){if(!e._d){var t=T(e._i);e._a=a([t.year,t.month,t.day||t.date,t.hour,t.minute,t.second,t.millisecond],function(e){return e&&parseInt(e,10)}),he(e)}}(o):i(u)?o._d=new Date(u):e.createFromInputFallback(o)}(o),h(o)||(o._d=null),o))}function ge(e,s,i,r,a){var o={};return!0!==i&&!1!==i||(r=i,i=void 0),(n(e)&&function(e){if(Object.getOwnPropertyNames)return 0===Object.getOwnPropertyNames(e).length;var t;for(t in e)if(e.hasOwnProperty(t))return!1;return!0}(e)||t(e)&&0===e.length)&&(e=void 0),o._isAMomentObject=!0,o._useUTC=o._isUTC=a,o._l=i,o._i=e,o._f=s,o._strict=r,function(e){var t=new m(le(ye(e)));return t._nextDay&&(t.add(1,"d"),t._nextDay=void 0),t}(o)}function pe(e,t,n,s){return ge(e,t,n,s,!1)}function we(e,n){var s,i;if(1===n.length&&t(n[0])&&(n=n[0]),!n.length)return pe();for(s=n[0],i=1;i<n.length;++i)n[i].isValid()&&!n[i][e](s)||(s=n[i]);return s}function ve(e){var t=T(e),n=t.year||0,s=t.quarter||0,i=t.month||0,r=t.week||0,a=t.day||0,o=t.hour||0,u=t.minute||0,l=t.second||0,d=t.millisecond||0;this._isValid=function(e){for(var t in e)if(-1===Ut.call(hn,t)||null!=e[t]&&isNaN(e[t]))return!1;for(var n=!1,s=0;s<hn.length;++s)if(e[hn[s]]){if(n)return!1;parseFloat(e[hn[s]])!==g(e[hn[s]])&&(n=!0)}return!0}(t),this._milliseconds=+d+1e3*l+6e4*u+1e3*o*60*60,this._days=+a+7*r,this._months=+i+3*s+12*n,this._data={},this._locale=ue(),this._bubble()}function Me(e){return e instanceof ve}function Se(e){return e<0?-1*Math.round(-1*e):Math.round(e)}function De(e,t){P(e,0,0,function(){var e=this.utcOffset(),n="+";return e<0&&(e=-e,n="-"),n+b(~~(e/60),2)+t+b(~~e%60,2)})}function ke(e,t){var n=(t||"").match(e);if(null===n)return null;var s=((n[n.length-1]||[])+"").match(cn)||["-",0,0],i=60*s[1]+g(s[2]);return 0===i?0:"+"===s[0]?i:-i}function Ye(t,n){var s,i;return n._isUTC?(s=n.clone(),i=(_(t)||r(t)?t.valueOf():pe(t).valueOf())-s.valueOf(),s._d.setTime(s._d.valueOf()+i),e.updateOffset(s,!1),s):pe(t).local()}function Oe(e){return 15*-Math.round(e._d.getTimezoneOffset()/15)}function Te(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}function xe(e,t){var n,s,r,a=e,u=null;return Me(e)?a={ms:e._milliseconds,d:e._days,M:e._months}:i(e)?(a={},t?a[t]=e:a.milliseconds=e):(u=fn.exec(e))?(n="-"===u[1]?-1:1,a={y:0,d:g(u[bt])*n,h:g(u[Pt])*n,m:g(u[Wt])*n,s:g(u[Ht])*n,ms:g(Se(1e3*u[Rt]))*n}):(u=mn.exec(e))?(n="-"===u[1]?-1:(u[1],1),a={y:be(u[2],n),M:be(u[3],n),w:be(u[4],n),d:be(u[5],n),h:be(u[6],n),m:be(u[7],n),s:be(u[8],n)}):null==a?a={}:"object"==typeof a&&("from"in a||"to"in a)&&(r=function(e,t){var n;if(!e.isValid()||!t.isValid())return{milliseconds:0,months:0};t=Ye(t,e),e.isBefore(t)?n=Pe(e,t):((n=Pe(t,e)).milliseconds=-n.milliseconds,n.months=-n.months);return n}(pe(a.from),pe(a.to)),(a={}).ms=r.milliseconds,a.M=r.months),s=new ve(a),Me(e)&&o(e,"_locale")&&(s._locale=e._locale),s}function be(e,t){var n=e&&parseFloat(e.replace(",","."));return(isNaN(n)?0:n)*t}function Pe(e,t){var n={milliseconds:0,months:0};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=+t-+e.clone().add(n.months,"M"),n}function We(e,t){return function(n,s){var i,r;return null===s||isNaN(+s)||(M(t,"moment()."+t+"(period, number) is deprecated. Please use moment()."+t+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),r=n,n=s,s=r),n="string"==typeof n?+n:n,i=xe(n,s),He(this,i,e),this}}function He(t,n,s,i){var r=n._milliseconds,a=Se(n._days),o=Se(n._months);t.isValid()&&(i=null==i||i,o&&z(t,A(t,"Month")+o*s),a&&j(t,"Date",A(t,"Date")+a*s),r&&t._d.setTime(t._d.valueOf()+r*s),i&&e.updateOffset(t,a||o))}function Re(e,t){var n,s=12*(t.year()-e.year())+(t.month()-e.month()),i=e.clone().add(s,"months");return n=t-i<0?(t-i)/(i-e.clone().add(s-1,"months")):(t-i)/(e.clone().add(s+1,"months")-i),-(s+n)||0}function Ce(e){var t;return void 0===e?this._locale._abbr:(null!=(t=ue(e))&&(this._locale=t),this)}function Fe(){return this._locale}function Ue(e,t){P(0,[e,e.length],0,t)}function Le(e,t,n,s,i){var r;return null==e?X(this,s,i).year:(r=K(e,s,i),t>r&&(t=r),function(e,t,n,s,i){var r=Q(e,t,n,s,i),a=J(r.year,0,r.dayOfYear);return this.year(a.getUTCFullYear()),this.month(a.getUTCMonth()),this.date(a.getUTCDate()),this}.call(this,e,t,n,s,i))}function Ne(e,t){t[Rt]=g(1e3*("0."+e))}function Ge(e){return e}function Ve(e,t,n,s){var i=ue(),r=l().set(s,t);return i[n](r,e)}function Ee(e,t,n){if(i(e)&&(t=e,e=void 0),e=e||"",null!=t)return Ve(e,t,n,"month");var s,r=[];for(s=0;s<12;s++)r[s]=Ve(e,s,n,"month");return r}function Ie(e,t,n,s){"boolean"==typeof e?(i(t)&&(n=t,t=void 0),t=t||""):(n=t=e,e=!1,i(t)&&(n=t,t=void 0),t=t||"");var r=ue(),a=e?r._week.dow:0;if(null!=n)return Ve(t,(n+a)%7,s,"day");var o,u=[];for(o=0;o<7;o++)u[o]=Ve(t,(o+a)%7,s,"day");return u}function Ae(e,t,n,s){var i=xe(t,n);return e._milliseconds+=s*i._milliseconds,e._days+=s*i._days,e._months+=s*i._months,e._bubble()}function je(e){return e<0?Math.floor(e):Math.ceil(e)}function Ze(e){return 4800*e/146097}function ze(e){return 146097*e/4800}function $e(e){return function(){return this.as(e)}}function qe(e){return function(){return this.isValid()?this._data[e]:NaN}}function Je(e){return(e>0)-(e<0)||+e}function Be(){if(!this.isValid())return this.localeData().invalidDate();var e,t,n=An(this._milliseconds)/1e3,s=An(this._days),i=An(this._months);t=y((e=y(n/60))/60),n%=60,e%=60;var r=y(i/12),a=i%=12,o=s,u=t,l=e,d=n?n.toFixed(3).replace(/\.?0+$/,""):"",h=this.asSeconds();if(!h)return"P0D";var c=h<0?"-":"",f=Je(this._months)!==Je(h)?"-":"",m=Je(this._days)!==Je(h)?"-":"",_=Je(this._milliseconds)!==Je(h)?"-":"";return c+"P"+(r?f+r+"Y":"")+(a?f+a+"M":"")+(o?m+o+"D":"")+(u||l||d?"T":"")+(u?_+u+"H":"")+(l?_+l+"M":"")+(d?_+d+"S":"")}var Qe,Xe;Xe=Array.prototype.some?Array.prototype.some:function(e){for(var t=Object(this),n=t.length>>>0,s=0;s<n;s++)if(s in t&&e.call(this,t[s],s,t))return!0;return!1};var Ke=e.momentProperties=[],et=!1,tt={};e.suppressDeprecationWarnings=!1,e.deprecationHandler=null;var nt;nt=Object.keys?Object.keys:function(e){var t,n=[];for(t in e)o(e,t)&&n.push(t);return n};var st={},it={},rt=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,at=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,ot={},ut={},lt=/\d/,dt=/\d\d/,ht=/\d{3}/,ct=/\d{4}/,ft=/[+-]?\d{6}/,mt=/\d\d?/,_t=/\d\d\d\d?/,yt=/\d\d\d\d\d\d?/,gt=/\d{1,3}/,pt=/\d{1,4}/,wt=/[+-]?\d{1,6}/,vt=/\d+/,Mt=/[+-]?\d+/,St=/Z|[+-]\d\d:?\d\d/gi,Dt=/Z|[+-]\d\d(?::?\d\d)?/gi,kt=/[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,Yt={},Ot={},Tt=0,xt=1,bt=2,Pt=3,Wt=4,Ht=5,Rt=6,Ct=7,Ft=8;P("Y",0,0,function(){var e=this.year();return e<=9999?""+e:"+"+e}),P(0,["YY",2],0,function(){return this.year()%100}),P(0,["YYYY",4],0,"year"),P(0,["YYYYY",5],0,"year"),P(0,["YYYYYY",6,!0],0,"year"),Y("year","y"),x("year",1),C("Y",Mt),C("YY",mt,dt),C("YYYY",pt,ct),C("YYYYY",wt,ft),C("YYYYYY",wt,ft),L(["YYYYY","YYYYYY"],Tt),L("YYYY",function(t,n){n[Tt]=2===t.length?e.parseTwoDigitYear(t):g(t)}),L("YY",function(t,n){n[Tt]=e.parseTwoDigitYear(t)}),L("Y",function(e,t){t[Tt]=parseInt(e,10)}),e.parseTwoDigitYear=function(e){return g(e)+(g(e)>68?1900:2e3)};var Ut,Lt=I("FullYear",!0);Ut=Array.prototype.indexOf?Array.prototype.indexOf:function(e){var t;for(t=0;t<this.length;++t)if(this[t]===e)return t;return-1},P("M",["MM",2],"Mo",function(){return this.month()+1}),P("MMM",0,0,function(e){return this.localeData().monthsShort(this,e)}),P("MMMM",0,0,function(e){return this.localeData().months(this,e)}),Y("month","M"),x("month",8),C("M",mt),C("MM",mt,dt),C("MMM",function(e,t){return t.monthsShortRegex(e)}),C("MMMM",function(e,t){return t.monthsRegex(e)}),L(["M","MM"],function(e,t){t[xt]=g(e)-1}),L(["MMM","MMMM"],function(e,t,n,s){var i=n._locale.monthsParse(e,s,n._strict);null!=i?t[xt]=i:d(n).invalidMonth=e});var Nt=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,Gt="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),Vt="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),Et=kt,It=kt;P("w",["ww",2],"wo","week"),P("W",["WW",2],"Wo","isoWeek"),Y("week","w"),Y("isoWeek","W"),x("week",5),x("isoWeek",5),C("w",mt),C("ww",mt,dt),C("W",mt),C("WW",mt,dt),N(["w","ww","W","WW"],function(e,t,n,s){t[s.substr(0,1)]=g(e)});P("d",0,"do","day"),P("dd",0,0,function(e){return this.localeData().weekdaysMin(this,e)}),P("ddd",0,0,function(e){return this.localeData().weekdaysShort(this,e)}),P("dddd",0,0,function(e){return this.localeData().weekdays(this,e)}),P("e",0,0,"weekday"),P("E",0,0,"isoWeekday"),Y("day","d"),Y("weekday","e"),Y("isoWeekday","E"),x("day",11),x("weekday",11),x("isoWeekday",11),C("d",mt),C("e",mt),C("E",mt),C("dd",function(e,t){return t.weekdaysMinRegex(e)}),C("ddd",function(e,t){return t.weekdaysShortRegex(e)}),C("dddd",function(e,t){return t.weekdaysRegex(e)}),N(["dd","ddd","dddd"],function(e,t,n,s){var i=n._locale.weekdaysParse(e,s,n._strict);null!=i?t.d=i:d(n).invalidWeekday=e}),N(["d","e","E"],function(e,t,n,s){t[s]=g(e)});var At="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),jt="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Zt="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),zt=kt,$t=kt,qt=kt;P("H",["HH",2],0,"hour"),P("h",["hh",2],0,te),P("k",["kk",2],0,function(){return this.hours()||24}),P("hmm",0,0,function(){return""+te.apply(this)+b(this.minutes(),2)}),P("hmmss",0,0,function(){return""+te.apply(this)+b(this.minutes(),2)+b(this.seconds(),2)}),P("Hmm",0,0,function(){return""+this.hours()+b(this.minutes(),2)}),P("Hmmss",0,0,function(){return""+this.hours()+b(this.minutes(),2)+b(this.seconds(),2)}),ne("a",!0),ne("A",!1),Y("hour","h"),x("hour",13),C("a",se),C("A",se),C("H",mt),C("h",mt),C("k",mt),C("HH",mt,dt),C("hh",mt,dt),C("kk",mt,dt),C("hmm",_t),C("hmmss",yt),C("Hmm",_t),C("Hmmss",yt),L(["H","HH"],Pt),L(["k","kk"],function(e,t,n){var s=g(e);t[Pt]=24===s?0:s}),L(["a","A"],function(e,t,n){n._isPm=n._locale.isPM(e),n._meridiem=e}),L(["h","hh"],function(e,t,n){t[Pt]=g(e),d(n).bigHour=!0}),L("hmm",function(e,t,n){var s=e.length-2;t[Pt]=g(e.substr(0,s)),t[Wt]=g(e.substr(s)),d(n).bigHour=!0}),L("hmmss",function(e,t,n){var s=e.length-4,i=e.length-2;t[Pt]=g(e.substr(0,s)),t[Wt]=g(e.substr(s,2)),t[Ht]=g(e.substr(i)),d(n).bigHour=!0}),L("Hmm",function(e,t,n){var s=e.length-2;t[Pt]=g(e.substr(0,s)),t[Wt]=g(e.substr(s))}),L("Hmmss",function(e,t,n){var s=e.length-4,i=e.length-2;t[Pt]=g(e.substr(0,s)),t[Wt]=g(e.substr(s,2)),t[Ht]=g(e.substr(i))});var Jt,Bt=I("Hours",!0),Qt={calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},invalidDate:"Invalid date",ordinal:"%d",dayOfMonthOrdinalParse:/\d{1,2}/,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},months:Gt,monthsShort:Vt,week:{dow:0,doy:6},weekdays:At,weekdaysMin:Zt,weekdaysShort:jt,meridiemParse:/[ap]\.?m?\.?/i},Xt={},Kt={},en=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,tn=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,nn=/Z|[+-]\d\d(?::?\d\d)?/,sn=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/]],rn=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],an=/^\/?Date\((\-?\d+)/i,on=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,un={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};e.createFromInputFallback=v("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),e.ISO_8601=function(){},e.RFC_2822=function(){};var ln=v("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=pe.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:c()}),dn=v("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=pe.apply(null,arguments);return this.isValid()&&e.isValid()?e>this?this:e:c()}),hn=["year","quarter","month","week","day","hour","minute","second","millisecond"];De("Z",":"),De("ZZ",""),C("Z",Dt),C("ZZ",Dt),L(["Z","ZZ"],function(e,t,n){n._useUTC=!0,n._tzm=ke(Dt,e)});var cn=/([\+\-]|\d\d)/gi;e.updateOffset=function(){};var fn=/^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/,mn=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;xe.fn=ve.prototype,xe.invalid=function(){return xe(NaN)};var _n=We(1,"add"),yn=We(-1,"subtract");e.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",e.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";var gn=v("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(e){return void 0===e?this.localeData():this.locale(e)});P(0,["gg",2],0,function(){return this.weekYear()%100}),P(0,["GG",2],0,function(){return this.isoWeekYear()%100}),Ue("gggg","weekYear"),Ue("ggggg","weekYear"),Ue("GGGG","isoWeekYear"),Ue("GGGGG","isoWeekYear"),Y("weekYear","gg"),Y("isoWeekYear","GG"),x("weekYear",1),x("isoWeekYear",1),C("G",Mt),C("g",Mt),C("GG",mt,dt),C("gg",mt,dt),C("GGGG",pt,ct),C("gggg",pt,ct),C("GGGGG",wt,ft),C("ggggg",wt,ft),N(["gggg","ggggg","GGGG","GGGGG"],function(e,t,n,s){t[s.substr(0,2)]=g(e)}),N(["gg","GG"],function(t,n,s,i){n[i]=e.parseTwoDigitYear(t)}),P("Q",0,"Qo","quarter"),Y("quarter","Q"),x("quarter",7),C("Q",lt),L("Q",function(e,t){t[xt]=3*(g(e)-1)}),P("D",["DD",2],"Do","date"),Y("date","D"),x("date",9),C("D",mt),C("DD",mt,dt),C("Do",function(e,t){return e?t._dayOfMonthOrdinalParse||t._ordinalParse:t._dayOfMonthOrdinalParseLenient}),L(["D","DD"],bt),L("Do",function(e,t){t[bt]=g(e.match(mt)[0])});var pn=I("Date",!0);P("DDD",["DDDD",3],"DDDo","dayOfYear"),Y("dayOfYear","DDD"),x("dayOfYear",4),C("DDD",gt),C("DDDD",ht),L(["DDD","DDDD"],function(e,t,n){n._dayOfYear=g(e)}),P("m",["mm",2],0,"minute"),Y("minute","m"),x("minute",14),C("m",mt),C("mm",mt,dt),L(["m","mm"],Wt);var wn=I("Minutes",!1);P("s",["ss",2],0,"second"),Y("second","s"),x("second",15),C("s",mt),C("ss",mt,dt),L(["s","ss"],Ht);var vn=I("Seconds",!1);P("S",0,0,function(){return~~(this.millisecond()/100)}),P(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),P(0,["SSS",3],0,"millisecond"),P(0,["SSSS",4],0,function(){return 10*this.millisecond()}),P(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),P(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),P(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),P(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),P(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),Y("millisecond","ms"),x("millisecond",16),C("S",gt,lt),C("SS",gt,dt),C("SSS",gt,ht);var Mn;for(Mn="SSSS";Mn.length<=9;Mn+="S")C(Mn,vt);for(Mn="S";Mn.length<=9;Mn+="S")L(Mn,Ne);var Sn=I("Milliseconds",!1);P("z",0,0,"zoneAbbr"),P("zz",0,0,"zoneName");var Dn=m.prototype;Dn.add=_n,Dn.calendar=function(t,n){var s=t||pe(),i=Ye(s,this).startOf("day"),r=e.calendarFormat(this,i)||"sameElse",a=n&&(S(n[r])?n[r].call(this,s):n[r]);return this.format(a||this.localeData().calendar(r,this,pe(s)))},Dn.clone=function(){return new m(this)},Dn.diff=function(e,t,n){var s,i,r;if(!this.isValid())return NaN;if(!(s=Ye(e,this)).isValid())return NaN;switch(i=6e4*(s.utcOffset()-this.utcOffset()),t=O(t)){case"year":r=Re(this,s)/12;break;case"month":r=Re(this,s);break;case"quarter":r=Re(this,s)/3;break;case"second":r=(this-s)/1e3;break;case"minute":r=(this-s)/6e4;break;case"hour":r=(this-s)/36e5;break;case"day":r=(this-s-i)/864e5;break;case"week":r=(this-s-i)/6048e5;break;default:r=this-s}return n?r:y(r)},Dn.endOf=function(e){return void 0===(e=O(e))||"millisecond"===e?this:("date"===e&&(e="day"),this.startOf(e).add(1,"isoWeek"===e?"week":e).subtract(1,"ms"))},Dn.format=function(t){t||(t=this.isUtc()?e.defaultFormatUtc:e.defaultFormat);var n=H(this,t);return this.localeData().postformat(n)},Dn.from=function(e,t){return this.isValid()&&(_(e)&&e.isValid()||pe(e).isValid())?xe({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},Dn.fromNow=function(e){return this.from(pe(),e)},Dn.to=function(e,t){return this.isValid()&&(_(e)&&e.isValid()||pe(e).isValid())?xe({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},Dn.toNow=function(e){return this.to(pe(),e)},Dn.get=function(e){return e=O(e),S(this[e])?this[e]():this},Dn.invalidAt=function(){return d(this).overflow},Dn.isAfter=function(e,t){var n=_(e)?e:pe(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=O(s(t)?"millisecond":t))?this.valueOf()>n.valueOf():n.valueOf()<this.clone().startOf(t).valueOf())},Dn.isBefore=function(e,t){var n=_(e)?e:pe(e);return!(!this.isValid()||!n.isValid())&&("millisecond"===(t=O(s(t)?"millisecond":t))?this.valueOf()<n.valueOf():this.clone().endOf(t).valueOf()<n.valueOf())},Dn.isBetween=function(e,t,n,s){return("("===(s=s||"()")[0]?this.isAfter(e,n):!this.isBefore(e,n))&&(")"===s[1]?this.isBefore(t,n):!this.isAfter(t,n))},Dn.isSame=function(e,t){var n,s=_(e)?e:pe(e);return!(!this.isValid()||!s.isValid())&&("millisecond"===(t=O(t||"millisecond"))?this.valueOf()===s.valueOf():(n=s.valueOf(),this.clone().startOf(t).valueOf()<=n&&n<=this.clone().endOf(t).valueOf()))},Dn.isSameOrAfter=function(e,t){return this.isSame(e,t)||this.isAfter(e,t)},Dn.isSameOrBefore=function(e,t){return this.isSame(e,t)||this.isBefore(e,t)},Dn.isValid=function(){return h(this)},Dn.lang=gn,Dn.locale=Ce,Dn.localeData=Fe,Dn.max=dn,Dn.min=ln,Dn.parsingFlags=function(){return u({},d(this))},Dn.set=function(e,t){if("object"==typeof e)for(var n=function(e){var t=[];for(var n in e)t.push({unit:n,priority:it[n]});return t.sort(function(e,t){return e.priority-t.priority}),t}(e=T(e)),s=0;s<n.length;s++)this[n[s].unit](e[n[s].unit]);else if(e=O(e),S(this[e]))return this[e](t);return this},Dn.startOf=function(e){switch(e=O(e)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":case"date":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===e&&this.weekday(0),"isoWeek"===e&&this.isoWeekday(1),"quarter"===e&&this.month(3*Math.floor(this.month()/3)),this},Dn.subtract=yn,Dn.toArray=function(){return[this.year(),this.month(),this.date(),this.hour(),this.minute(),this.second(),this.millisecond()]},Dn.toObject=function(){return{years:this.year(),months:this.month(),date:this.date(),hours:this.hours(),minutes:this.minutes(),seconds:this.seconds(),milliseconds:this.milliseconds()}},Dn.toDate=function(){return new Date(this.valueOf())},Dn.toISOString=function(e){if(!this.isValid())return null;var t=!0!==e,n=t?this.clone().utc():this;return n.year()<0||n.year()>9999?H(n,t?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):S(Date.prototype.toISOString)?t?this.toDate().toISOString():new Date(this._d.valueOf()).toISOString().replace("Z",H(n,"Z")):H(n,t?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")},Dn.inspect=function(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e="moment",t="";this.isLocal()||(e=0===this.utcOffset()?"moment.utc":"moment.parseZone",t="Z");var n="["+e+'("]',s=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",i=t+'[")]';return this.format(n+s+"-MM-DD[T]HH:mm:ss.SSS"+i)},Dn.toJSON=function(){return this.isValid()?this.toISOString():null},Dn.toString=function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},Dn.unix=function(){return Math.floor(this.valueOf()/1e3)},Dn.valueOf=function(){return this._d.valueOf()-6e4*(this._offset||0)},Dn.creationData=function(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}},Dn.year=Lt,Dn.isLeapYear=function(){return E(this.year())},Dn.weekYear=function(e){return Le.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)},Dn.isoWeekYear=function(e){return Le.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)},Dn.quarter=Dn.quarters=function(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)},Dn.month=$,Dn.daysInMonth=function(){return Z(this.year(),this.month())},Dn.week=Dn.weeks=function(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")},Dn.isoWeek=Dn.isoWeeks=function(e){var t=X(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")},Dn.weeksInYear=function(){var e=this.localeData()._week;return K(this.year(),e.dow,e.doy)},Dn.isoWeeksInYear=function(){return K(this.year(),1,4)},Dn.date=pn,Dn.day=Dn.days=function(e){if(!this.isValid())return null!=e?this:NaN;var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(e=function(e,t){return"string"!=typeof e?e:isNaN(e)?"number"==typeof(e=t.weekdaysParse(e))?e:null:parseInt(e,10)}(e,this.localeData()),this.add(e-t,"d")):t},Dn.weekday=function(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")},Dn.isoWeekday=function(e){if(!this.isValid())return null!=e?this:NaN;if(null!=e){var t=function(e,t){return"string"==typeof e?t.weekdaysParse(e)%7||7:isNaN(e)?null:e}(e,this.localeData());return this.day(this.day()%7?t:t-7)}return this.day()||7},Dn.dayOfYear=function(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")},Dn.hour=Dn.hours=Bt,Dn.minute=Dn.minutes=wn,Dn.second=Dn.seconds=vn,Dn.millisecond=Dn.milliseconds=Sn,Dn.utcOffset=function(t,n,s){var i,r=this._offset||0;if(!this.isValid())return null!=t?this:NaN;if(null!=t){if("string"==typeof t){if(null===(t=ke(Dt,t)))return this}else Math.abs(t)<16&&!s&&(t*=60);return!this._isUTC&&n&&(i=Oe(this)),this._offset=t,this._isUTC=!0,null!=i&&this.add(i,"m"),r!==t&&(!n||this._changeInProgress?He(this,xe(t-r,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,e.updateOffset(this,!0),this._changeInProgress=null)),this}return this._isUTC?r:Oe(this)},Dn.utc=function(e){return this.utcOffset(0,e)},Dn.local=function(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(Oe(this),"m")),this},Dn.parseZone=function(){if(null!=this._tzm)this.utcOffset(this._tzm,!1,!0);else if("string"==typeof this._i){var e=ke(St,this._i);null!=e?this.utcOffset(e):this.utcOffset(0,!0)}return this},Dn.hasAlignedHourOffset=function(e){return!!this.isValid()&&(e=e?pe(e).utcOffset():0,(this.utcOffset()-e)%60==0)},Dn.isDST=function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},Dn.isLocal=function(){return!!this.isValid()&&!this._isUTC},Dn.isUtcOffset=function(){return!!this.isValid()&&this._isUTC},Dn.isUtc=Te,Dn.isUTC=Te,Dn.zoneAbbr=function(){return this._isUTC?"UTC":""},Dn.zoneName=function(){return this._isUTC?"Coordinated Universal Time":""},Dn.dates=v("dates accessor is deprecated. Use date instead.",pn),Dn.months=v("months accessor is deprecated. Use month instead",$),Dn.years=v("years accessor is deprecated. Use year instead",Lt),Dn.zone=v("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",function(e,t){return null!=e?("string"!=typeof e&&(e=-e),this.utcOffset(e,t),this):-this.utcOffset()}),Dn.isDSTShifted=v("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",function(){if(!s(this._isDSTShifted))return this._isDSTShifted;var e={};if(f(e,this),(e=ye(e))._a){var t=e._isUTC?l(e._a):pe(e._a);this._isDSTShifted=this.isValid()&&p(e._a,t.toArray())>0}else this._isDSTShifted=!1;return this._isDSTShifted});var kn=k.prototype;kn.calendar=function(e,t,n){var s=this._calendar[e]||this._calendar.sameElse;return S(s)?s.call(t,n):s},kn.longDateFormat=function(e){var t=this._longDateFormat[e],n=this._longDateFormat[e.toUpperCase()];return t||!n?t:(this._longDateFormat[e]=n.replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e])},kn.invalidDate=function(){return this._invalidDate},kn.ordinal=function(e){return this._ordinal.replace("%d",e)},kn.preparse=Ge,kn.postformat=Ge,kn.relativeTime=function(e,t,n,s){var i=this._relativeTime[n];return S(i)?i(e,t,n,s):i.replace(/%d/i,e)},kn.pastFuture=function(e,t){var n=this._relativeTime[e>0?"future":"past"];return S(n)?n(t):n.replace(/%s/i,t)},kn.set=function(e){var t,n;for(n in e)S(t=e[n])?this[n]=t:this["_"+n]=t;this._config=e,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)},kn.months=function(e,n){return e?t(this._months)?this._months[e.month()]:this._months[(this._months.isFormat||Nt).test(n)?"format":"standalone"][e.month()]:t(this._months)?this._months:this._months.standalone},kn.monthsShort=function(e,n){return e?t(this._monthsShort)?this._monthsShort[e.month()]:this._monthsShort[Nt.test(n)?"format":"standalone"][e.month()]:t(this._monthsShort)?this._monthsShort:this._monthsShort.standalone},kn.monthsParse=function(e,t,n){var s,i,r;if(this._monthsParseExact)return function(e,t,n){var s,i,r,a=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],s=0;s<12;++s)r=l([2e3,s]),this._shortMonthsParse[s]=this.monthsShort(r,"").toLocaleLowerCase(),this._longMonthsParse[s]=this.months(r,"").toLocaleLowerCase();return n?"MMM"===t?-1!==(i=Ut.call(this._shortMonthsParse,a))?i:null:-1!==(i=Ut.call(this._longMonthsParse,a))?i:null:"MMM"===t?-1!==(i=Ut.call(this._shortMonthsParse,a))?i:-1!==(i=Ut.call(this._longMonthsParse,a))?i:null:-1!==(i=Ut.call(this._longMonthsParse,a))?i:-1!==(i=Ut.call(this._shortMonthsParse,a))?i:null}.call(this,e,t,n);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),s=0;s<12;s++){if(i=l([2e3,s]),n&&!this._longMonthsParse[s]&&(this._longMonthsParse[s]=new RegExp("^"+this.months(i,"").replace(".","")+"$","i"),this._shortMonthsParse[s]=new RegExp("^"+this.monthsShort(i,"").replace(".","")+"$","i")),n||this._monthsParse[s]||(r="^"+this.months(i,"")+"|^"+this.monthsShort(i,""),this._monthsParse[s]=new RegExp(r.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[s].test(e))return s;if(n&&"MMM"===t&&this._shortMonthsParse[s].test(e))return s;if(!n&&this._monthsParse[s].test(e))return s}},kn.monthsRegex=function(e){return this._monthsParseExact?(o(this,"_monthsRegex")||q.call(this),e?this._monthsStrictRegex:this._monthsRegex):(o(this,"_monthsRegex")||(this._monthsRegex=It),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)},kn.monthsShortRegex=function(e){return this._monthsParseExact?(o(this,"_monthsRegex")||q.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(o(this,"_monthsShortRegex")||(this._monthsShortRegex=Et),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)},kn.week=function(e){return X(e,this._week.dow,this._week.doy).week},kn.firstDayOfYear=function(){return this._week.doy},kn.firstDayOfWeek=function(){return this._week.dow},kn.weekdays=function(e,n){return e?t(this._weekdays)?this._weekdays[e.day()]:this._weekdays[this._weekdays.isFormat.test(n)?"format":"standalone"][e.day()]:t(this._weekdays)?this._weekdays:this._weekdays.standalone},kn.weekdaysMin=function(e){return e?this._weekdaysMin[e.day()]:this._weekdaysMin},kn.weekdaysShort=function(e){return e?this._weekdaysShort[e.day()]:this._weekdaysShort},kn.weekdaysParse=function(e,t,n){var s,i,r;if(this._weekdaysParseExact)return function(e,t,n){var s,i,r,a=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],s=0;s<7;++s)r=l([2e3,1]).day(s),this._minWeekdaysParse[s]=this.weekdaysMin(r,"").toLocaleLowerCase(),this._shortWeekdaysParse[s]=this.weekdaysShort(r,"").toLocaleLowerCase(),this._weekdaysParse[s]=this.weekdays(r,"").toLocaleLowerCase();return n?"dddd"===t?-1!==(i=Ut.call(this._weekdaysParse,a))?i:null:"ddd"===t?-1!==(i=Ut.call(this._shortWeekdaysParse,a))?i:null:-1!==(i=Ut.call(this._minWeekdaysParse,a))?i:null:"dddd"===t?-1!==(i=Ut.call(this._weekdaysParse,a))?i:-1!==(i=Ut.call(this._shortWeekdaysParse,a))?i:-1!==(i=Ut.call(this._minWeekdaysParse,a))?i:null:"ddd"===t?-1!==(i=Ut.call(this._shortWeekdaysParse,a))?i:-1!==(i=Ut.call(this._weekdaysParse,a))?i:-1!==(i=Ut.call(this._minWeekdaysParse,a))?i:null:-1!==(i=Ut.call(this._minWeekdaysParse,a))?i:-1!==(i=Ut.call(this._weekdaysParse,a))?i:-1!==(i=Ut.call(this._shortWeekdaysParse,a))?i:null}.call(this,e,t,n);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),s=0;s<7;s++){if(i=l([2e3,1]).day(s),n&&!this._fullWeekdaysParse[s]&&(this._fullWeekdaysParse[s]=new RegExp("^"+this.weekdays(i,"").replace(".",".?")+"$","i"),this._shortWeekdaysParse[s]=new RegExp("^"+this.weekdaysShort(i,"").replace(".",".?")+"$","i"),this._minWeekdaysParse[s]=new RegExp("^"+this.weekdaysMin(i,"").replace(".",".?")+"$","i")),this._weekdaysParse[s]||(r="^"+this.weekdays(i,"")+"|^"+this.weekdaysShort(i,"")+"|^"+this.weekdaysMin(i,""),this._weekdaysParse[s]=new RegExp(r.replace(".",""),"i")),n&&"dddd"===t&&this._fullWeekdaysParse[s].test(e))return s;if(n&&"ddd"===t&&this._shortWeekdaysParse[s].test(e))return s;if(n&&"dd"===t&&this._minWeekdaysParse[s].test(e))return s;if(!n&&this._weekdaysParse[s].test(e))return s}},kn.weekdaysRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||ee.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(o(this,"_weekdaysRegex")||(this._weekdaysRegex=zt),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)},kn.weekdaysShortRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||ee.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(o(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=$t),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)},kn.weekdaysMinRegex=function(e){return this._weekdaysParseExact?(o(this,"_weekdaysRegex")||ee.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(o(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=qt),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)},kn.isPM=function(e){return"p"===(e+"").toLowerCase().charAt(0)},kn.meridiem=function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},ae("en",{dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10;return e+(1===g(e%100/10)?"th":1===t?"st":2===t?"nd":3===t?"rd":"th")}}),e.lang=v("moment.lang is deprecated. Use moment.locale instead.",ae),e.langData=v("moment.langData is deprecated. Use moment.localeData instead.",ue);var Yn=Math.abs,On=$e("ms"),Tn=$e("s"),xn=$e("m"),bn=$e("h"),Pn=$e("d"),Wn=$e("w"),Hn=$e("M"),Rn=$e("y"),Cn=qe("milliseconds"),Fn=qe("seconds"),Un=qe("minutes"),Ln=qe("hours"),Nn=qe("days"),Gn=qe("months"),Vn=qe("years"),En=Math.round,In={ss:44,s:45,m:45,h:22,d:26,M:11},An=Math.abs,jn=ve.prototype;return jn.isValid=function(){return this._isValid},jn.abs=function(){var e=this._data;return this._milliseconds=Yn(this._milliseconds),this._days=Yn(this._days),this._months=Yn(this._months),e.milliseconds=Yn(e.milliseconds),e.seconds=Yn(e.seconds),e.minutes=Yn(e.minutes),e.hours=Yn(e.hours),e.months=Yn(e.months),e.years=Yn(e.years),this},jn.add=function(e,t){return Ae(this,e,t,1)},jn.subtract=function(e,t){return Ae(this,e,t,-1)},jn.as=function(e){if(!this.isValid())return NaN;var t,n,s=this._milliseconds;if("month"===(e=O(e))||"year"===e)return t=this._days+s/864e5,n=this._months+Ze(t),"month"===e?n:n/12;switch(t=this._days+Math.round(ze(this._months)),e){case"week":return t/7+s/6048e5;case"day":return t+s/864e5;case"hour":return 24*t+s/36e5;case"minute":return 1440*t+s/6e4;case"second":return 86400*t+s/1e3;case"millisecond":return Math.floor(864e5*t)+s;default:throw new Error("Unknown unit "+e)}},jn.asMilliseconds=On,jn.asSeconds=Tn,jn.asMinutes=xn,jn.asHours=bn,jn.asDays=Pn,jn.asWeeks=Wn,jn.asMonths=Hn,jn.asYears=Rn,jn.valueOf=function(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*g(this._months/12):NaN},jn._bubble=function(){var e,t,n,s,i,r=this._milliseconds,a=this._days,o=this._months,u=this._data;return r>=0&&a>=0&&o>=0||r<=0&&a<=0&&o<=0||(r+=864e5*je(ze(o)+a),a=0,o=0),u.milliseconds=r%1e3,e=y(r/1e3),u.seconds=e%60,t=y(e/60),u.minutes=t%60,n=y(t/60),u.hours=n%24,a+=y(n/24),i=y(Ze(a)),o+=i,a-=je(ze(i)),s=y(o/12),o%=12,u.days=a,u.months=o,u.years=s,this},jn.clone=function(){return xe(this)},jn.get=function(e){return e=O(e),this.isValid()?this[e+"s"]():NaN},jn.milliseconds=Cn,jn.seconds=Fn,jn.minutes=Un,jn.hours=Ln,jn.days=Nn,jn.weeks=function(){return y(this.days()/7)},jn.months=Gn,jn.years=Vn,jn.humanize=function(e){if(!this.isValid())return this.localeData().invalidDate();var t=this.localeData(),n=function(e,t,n){var s=xe(e).abs(),i=En(s.as("s")),r=En(s.as("m")),a=En(s.as("h")),o=En(s.as("d")),u=En(s.as("M")),l=En(s.as("y")),d=i<=In.ss&&["s",i]||i<In.s&&["ss",i]||r<=1&&["m"]||r<In.m&&["mm",r]||a<=1&&["h"]||a<In.h&&["hh",a]||o<=1&&["d"]||o<In.d&&["dd",o]||u<=1&&["M"]||u<In.M&&["MM",u]||l<=1&&["y"]||["yy",l];return d[2]=t,d[3]=+e>0,d[4]=n,function(e,t,n,s,i){return i.relativeTime(t||1,!!n,e,s)}.apply(null,d)}(this,!e,t);return e&&(n=t.pastFuture(+this,n)),t.postformat(n)},jn.toISOString=Be,jn.toString=Be,jn.toJSON=Be,jn.locale=Ce,jn.localeData=Fe,jn.toIsoString=v("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Be),jn.lang=gn,P("X",0,0,"unix"),P("x",0,0,"valueOf"),C("x",Mt),C("X",/[+-]?\d+(\.\d{1,3})?/),L("X",function(e,t,n){n._d=new Date(1e3*parseFloat(e,10))}),L("x",function(e,t,n){n._d=new Date(g(e))}),e.version="2.20.1",function(e){Qe=e}(pe),e.fn=Dn,e.min=function(){return we("isBefore",[].slice.call(arguments,0))},e.max=function(){return we("isAfter",[].slice.call(arguments,0))},e.now=function(){return Date.now?Date.now():+new Date},e.utc=l,e.unix=function(e){return pe(1e3*e)},e.months=function(e,t){return Ee(e,t,"months")},e.isDate=r,e.locale=ae,e.invalid=c,e.duration=xe,e.isMoment=_,e.weekdays=function(e,t,n){return Ie(e,t,n,"weekdays")},e.parseZone=function(){return pe.apply(null,arguments).parseZone()},e.localeData=ue,e.isDuration=Me,e.monthsShort=function(e,t){return Ee(e,t,"monthsShort")},e.weekdaysMin=function(e,t,n){return Ie(e,t,n,"weekdaysMin")},e.defineLocale=oe,e.updateLocale=function(e,t){if(null!=t){var n,s,i=Qt;null!=(s=re(e))&&(i=s._config),(n=new k(t=D(i,t))).parentLocale=Xt[e],Xt[e]=n,ae(e)}else null!=Xt[e]&&(null!=Xt[e].parentLocale?Xt[e]=Xt[e].parentLocale:null!=Xt[e]&&delete Xt[e]);return Xt[e]},e.locales=function(){return nt(Xt)},e.weekdaysShort=function(e,t,n){return Ie(e,t,n,"weekdaysShort")},e.normalizeUnits=O,e.relativeTimeRounding=function(e){return void 0===e?En:"function"==typeof e&&(En=e,!0)},e.relativeTimeThreshold=function(e,t){return void 0!==In[e]&&(void 0===t?In[e]:(In[e]=t,"s"===e&&(In.ss=t-1),!0))},e.calendarFormat=function(e,t){var n=e.diff(t,"days",!0);return n<-6?"sameElse":n<-1?"lastWeek":n<0?"lastDay":n<1?"sameDay":n<2?"nextDay":n<7?"nextWeek":"sameElse"},e.prototype=Dn,e.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"YYYY-[W]WW",MONTH:"YYYY-MM"},e});
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return $('<button type="button" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                focusOnChange: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: false,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                swiping: false,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    Slick.prototype.activateADA = function() {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.getNavTarget = function() {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        _.autoPlayClear();

        if ( _.slideCount > _.options.slidesToShow ) {
            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if ( !_.paused && !_.interrupted && !_.focussed ) {

            if ( _.options.infinite === false ) {

                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
                    _.direction = 0;
                }

                else if ( _.direction === 0 ) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if ( _.currentSlide - 1 === 0 ) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler( slideTo );

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dot;

        if (_.options.dots === true) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.prependTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

            if (_.options.accessibility === true) {
                _.$dots.off('keydown.slick', _.keyHandler);
            }
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
                _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
            }
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.cleanUpSlideEvents = function() {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }
        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.focusHandler = function() {

        var _ = this;

        _.$slider
            .off('focus.slick blur.slick')
            .on('focus.slick blur.slick', '*', function(event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function() {

                if( _.options.pauseOnFocus ) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }

            }, 0);

        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            if (_.slideCount <= _.options.slidesToShow) {
                 ++pagerQty;
            } else {
                while (breakPoint < _.slideCount) {
                    ++pagerQty;
                    breakPoint = counter + _.options.slidesToScroll;
                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
                }
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if(!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        }else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide,
            coef;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                coef = -1

                if (_.options.vertical === true && _.options.centerMode === true) {
                    if (_.options.slidesToShow === 2) {
                        coef = -1.5;
                    } else if (_.options.slidesToShow === 1) {
                        coef = -2
                    }
                }
                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
        } else if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft =  0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft =  0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if ( _.options.autoplay ) {

            _.paused = false;
            _.autoPlay();

        }

    };

    Slick.prototype.initADA = function() {
        var _ = this,
                numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
                tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
                    return (val >= 0) && (val < _.slideCount);
                });

        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        if (_.$dots !== null) {
            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
                var slideControlIndex = tabControlIndexes.indexOf(i);

                $(this).attr({
                    'role': 'tabpanel',
                    'id': 'slick-slide' + _.instanceUid + i,
                    'tabindex': -1
                });

                if (slideControlIndex !== -1) {
                    $(this).attr({
                        'aria-describedby': 'slick-slide-control' + _.instanceUid + slideControlIndex
                    });
                }
            });

            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                var mappedSlideIndex = tabControlIndexes[i];

                $(this).attr({
                    'role': 'presentation'
                });

                $(this).find('button').first().attr({
                    'role': 'tab',
                    'id': 'slick-slide-control' + _.instanceUid + i,
                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
                    'aria-label': (i + 1) + ' of ' + numDotGroups,
                    'aria-selected': null,
                    'tabindex': '-1'
                });

            }).eq(_.currentSlide).find('button').attr({
                'aria-selected': 'true',
                'tabindex': '0'
            }).end();
        }

        for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {
            _.$slides.eq(i).attr('tabindex', 0);
        }

        _.activateADA();

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'previous'
               }, _.changeSlide);
            _.$nextArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'next'
               }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow.on('keydown.slick', _.keyHandler);
                _.$nextArrow.on('keydown.slick', _.keyHandler);
            }
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$dots.on('keydown.slick', _.keyHandler);
            }
        }

        if ( _.options.dots === true && _.options.pauseOnDotsHover === true ) {

            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initSlideEvents = function() {

        var _ = this;

        if ( _.options.pauseOnHover ) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(_.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' :  'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageSrcSet = $(this).attr('data-srcset'),
                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {

                    image
                        .animate({ opacity: 0 }, 100, function() {

                            if (imageSrcSet) {
                                image
                                    .attr('srcset', imageSrcSet );

                                if (imageSizes) {
                                    image
                                        .attr('sizes', imageSizes );
                                }
                            }

                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy data-srcset data-sizes')
                                        .removeClass('slick-loading');
                                });
                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                        });

                };

                imageToLoad.onerror = function() {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

        if (_.options.lazyLoad === 'anticipated') {
            var prevSlide = rangeStart - 1,
                nextSlide = rangeEnd,
                $slides = _.$slider.find('.slick-slide');

            for (var i = 0; i < _.options.slidesToScroll; i++) {
                if (prevSlide < 0) prevSlide = _.slideCount - 1;
                loadRange = loadRange.add($slides.eq(prevSlide));
                loadRange = loadRange.add($slides.eq(nextSlide));
                prevSlide--;
                nextSlide++;
            }
        }

        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        if( !_.unslicked ) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            if (_.slideCount > _.options.slidesToShow) {
                _.setPosition();
            }

            _.swipeLeft = null;

            if ( _.options.autoplay ) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();
                
                if (_.options.focusOnChange) {
                    var $currentSlide = $(_.$slides.get(_.currentSlide));
                    $currentSlide.attr('tabindex', 0).focus();
                }
            }

        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {

        event.preventDefault();

    };

    Slick.prototype.progressiveLazyLoad = function( tryCount ) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
            image,
            imageSource,
            imageSrcSet,
            imageSizes,
            imageToLoad;

        if ( $imgsToLoad.length ) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageSrcSet = image.attr('data-srcset');
            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function() {

                if (imageSrcSet) {
                    image
                        .attr('srcset', imageSrcSet );

                    if (imageSizes) {
                        image
                            .attr('sizes', imageSizes );
                    }
                }

                image
                    .attr( 'src', imageSource )
                    .removeAttr('data-lazy data-srcset data-sizes')
                    .removeClass('slick-loading');

                if ( _.options.adaptiveHeight === true ) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function() {

                if ( tryCount < 3 ) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout( function() {
                        _.progressiveLazyLoad( tryCount + 1 );
                    }, 500 );

                } else {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [ _ ]);

        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this, currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if ( _.slideCount <= _.options.slidesToShow ) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption =
    Slick.prototype.slickSetOption = function() {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this, l, item, option, value, refresh = false, type;

        if( $.type( arguments[0] ) === 'object' ) {

            option =  arguments[0];
            refresh = arguments[1];
            type = 'multiple';

        } else if ( $.type( arguments[0] ) === 'string' ) {

            option =  arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

                type = 'responsive';

            } else if ( typeof arguments[1] !== 'undefined' ) {

                type = 'single';

            }

        }

        if ( type === 'single' ) {

            _.options[option] = value;


        } else if ( type === 'multiple' ) {

            $.each( option , function( opt, val ) {

                _.options[opt] = val;

            });


        } else if ( type === 'responsive' ) {

            for ( item in value ) {

                if( $.type( _.options.responsive ) !== 'array' ) {

                    _.options.responsive = [ value[item] ];

                } else {

                    l = _.options.responsive.length-1;

                    // loop through the responsive object and splice out duplicates.
                    while( l >= 0 ) {

                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

                            _.options.responsive.splice(l,1);

                        }

                        l--;

                    }

                    _.options.responsive.push( value[item] );

                }

            }

        }

        if ( refresh ) {

            _.unload();
            _.reinit();

        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                    _.$slides
                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.interrupt = function( toggle ) {

        var _ = this;

        if( !toggle ) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.slideHandler(index, false, true);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this, navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if ( _.options.autoplay ) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if ( _.options.asNavFor ) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.swiping = false;

        if (_.scrolling) {
            _.scrolling = false;
            return false;
        }

        _.interrupted = false;
        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

        if ( _.touchObject.curX === undefined ) {
            return false;
        }

        if ( _.touchObject.edgeHit === true ) {
            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
        }

        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

            direction = _.swipeDirection();

            switch ( direction ) {

                case 'left':
                case 'down':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
                            _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
                            _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if( direction != 'vertical' ) {

                _.slideHandler( slideCount );
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction ]);

            }

        } else {

            if ( _.touchObject.startX !== _.touchObject.curX ) {

                _.slideHandler( _.currentSlide );
                _.touchObject = {};

            }

        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        verticalSwipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
            _.scrolling = true;
            return false;
        }

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = verticalSwipeLength;
        }

        swipeDirection = _.swipeDirection();

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            _.swiping = true;
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                    .removeClass('slick-active')
                    .end();

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if ( _.options.autoplay ) {

            if ( document[_.hidden] ) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));

/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/
(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
    if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
            u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
            h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
        a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
        y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);
!function(e,t,n){"use strict";!function o(e,t,n){function a(s,l){if(!t[s]){if(!e[s]){var i="function"==typeof require&&require;if(!l&&i)return i(s,!0);if(r)return r(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var c=t[s]={exports:{}};e[s][0].call(c.exports,function(t){var n=e[s][1][t];return a(n?n:t)},c,c.exports,o,e,t,n)}return t[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)a(n[s]);return a}({1:[function(o,a,r){function s(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(r,"__esModule",{value:!0});var l,i,u,c,d=o("./modules/handle-dom"),f=o("./modules/utils"),p=o("./modules/handle-swal-dom"),m=o("./modules/handle-click"),v=o("./modules/handle-key"),y=s(v),b=o("./modules/default-params"),h=s(b),g=o("./modules/set-params"),w=s(g);r["default"]=u=c=function(){function o(e){var t=a;return t[e]===n?h["default"][e]:t[e]}var a=arguments[0];if((0,d.addClass)(t.body,"stop-scrolling"),(0,p.resetInput)(),a===n)return(0,f.logStr)("SweetAlert expects at least 1 attribute!"),!1;var r=(0,f.extend)({},h["default"]);switch(typeof a){case"string":r.title=a,r.text=arguments[1]||"",r.type=arguments[2]||"";break;case"object":if(a.title===n)return(0,f.logStr)('Missing "title" argument!'),!1;r.title=a.title;for(var s in h["default"])r[s]=o(s);r.confirmButtonText=r.showCancelButton?"Confirm":h["default"].confirmButtonText,r.confirmButtonText=o("confirmButtonText"),r.doneFunction=arguments[1]||null;break;default:return(0,f.logStr)('Unexpected type of argument! Expected "string" or "object", got '+typeof a),!1}(0,w["default"])(r),(0,p.fixVerticalPosition)(),(0,p.openModal)(arguments[1]);for(var u=(0,p.getModal)(),v=u.querySelectorAll("button"),b=["onclick","onmouseover","onmouseout","onmousedown","onmouseup","onfocus"],g=function(e){return(0,m.handleButton)(e,r,u)},C=0;C<v.length;C++)for(var S=0;S<b.length;S++){var x=b[S];v[C][x]=g}(0,p.getOverlay)().onclick=g,l=e.onkeydown;var k=function(e){return(0,y["default"])(e,r,u)};e.onkeydown=k,e.onfocus=function(){setTimeout(function(){i!==n&&(i.focus(),i=n)},0)},c.enableButtons()},u.setDefaults=c.setDefaults=function(e){if(!e)throw new Error("userParams is required");if("object"!=typeof e)throw new Error("userParams has to be a object");(0,f.extend)(h["default"],e)},u.close=c.close=function(){var o=(0,p.getModal)();(0,d.fadeOut)((0,p.getOverlay)(),5),(0,d.fadeOut)(o,5),(0,d.removeClass)(o,"showSweetAlert"),(0,d.addClass)(o,"hideSweetAlert"),(0,d.removeClass)(o,"visible");var a=o.querySelector(".sa-icon.sa-success");(0,d.removeClass)(a,"animate"),(0,d.removeClass)(a.querySelector(".sa-tip"),"animateSuccessTip"),(0,d.removeClass)(a.querySelector(".sa-long"),"animateSuccessLong");var r=o.querySelector(".sa-icon.sa-error");(0,d.removeClass)(r,"animateErrorIcon"),(0,d.removeClass)(r.querySelector(".sa-x-mark"),"animateXMark");var s=o.querySelector(".sa-icon.sa-warning");return(0,d.removeClass)(s,"pulseWarning"),(0,d.removeClass)(s.querySelector(".sa-body"),"pulseWarningIns"),(0,d.removeClass)(s.querySelector(".sa-dot"),"pulseWarningIns"),setTimeout(function(){var e=o.getAttribute("data-custom-class");(0,d.removeClass)(o,e)},300),(0,d.removeClass)(t.body,"stop-scrolling"),e.onkeydown=l,e.previousActiveElement&&e.previousActiveElement.focus(),i=n,clearTimeout(o.timeout),!0},u.showInputError=c.showInputError=function(e){var t=(0,p.getModal)(),n=t.querySelector(".sa-input-error");(0,d.addClass)(n,"show");var o=t.querySelector(".sa-error-container");(0,d.addClass)(o,"show"),o.querySelector("p").innerHTML=e,setTimeout(function(){u.enableButtons()},1),t.querySelector("input").focus()},u.resetInputError=c.resetInputError=function(e){if(e&&13===e.keyCode)return!1;var t=(0,p.getModal)(),n=t.querySelector(".sa-input-error");(0,d.removeClass)(n,"show");var o=t.querySelector(".sa-error-container");(0,d.removeClass)(o,"show")},u.disableButtons=c.disableButtons=function(e){var t=(0,p.getModal)(),n=t.querySelector("button.confirm"),o=t.querySelector("button.cancel");n.disabled=!0,o.disabled=!0},u.enableButtons=c.enableButtons=function(e){var t=(0,p.getModal)(),n=t.querySelector("button.confirm"),o=t.querySelector("button.cancel");n.disabled=!1,o.disabled=!1},"undefined"!=typeof e?e.sweetAlert=e.swal=u:(0,f.logStr)("SweetAlert is a frontend module!"),a.exports=r["default"]},{"./modules/default-params":2,"./modules/handle-click":3,"./modules/handle-dom":4,"./modules/handle-key":5,"./modules/handle-swal-dom":6,"./modules/set-params":8,"./modules/utils":9}],2:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o={title:"",text:"",type:null,allowOutsideClick:!1,showConfirmButton:!0,showCancelButton:!1,closeOnConfirm:!0,closeOnCancel:!0,confirmButtonText:"OK",confirmButtonColor:"#8CD4F5",cancelButtonText:"Cancel",imageUrl:null,imageSize:null,timer:null,customClass:"",html:!1,animation:!0,allowEscapeKey:!0,inputType:"text",inputPlaceholder:"",inputValue:"",showLoaderOnConfirm:!1};n["default"]=o,t.exports=n["default"]},{}],3:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=t("./utils"),r=(t("./handle-swal-dom"),t("./handle-dom")),s=function(t,n,o){function s(e){m&&n.confirmButtonColor&&(p.style.backgroundColor=e)}var u,c,d,f=t||e.event,p=f.target||f.srcElement,m=-1!==p.className.indexOf("confirm"),v=-1!==p.className.indexOf("sweet-overlay"),y=(0,r.hasClass)(o,"visible"),b=n.doneFunction&&"true"===o.getAttribute("data-has-done-function");switch(m&&n.confirmButtonColor&&(u=n.confirmButtonColor,c=(0,a.colorLuminance)(u,-.04),d=(0,a.colorLuminance)(u,-.14)),f.type){case"mouseover":s(c);break;case"mouseout":s(u);break;case"mousedown":s(d);break;case"mouseup":s(c);break;case"focus":var h=o.querySelector("button.confirm"),g=o.querySelector("button.cancel");m?g.style.boxShadow="none":h.style.boxShadow="none";break;case"click":var w=o===p,C=(0,r.isDescendant)(o,p);if(!w&&!C&&y&&!n.allowOutsideClick)break;m&&b&&y?l(o,n):b&&y||v?i(o,n):(0,r.isDescendant)(o,p)&&"BUTTON"===p.tagName&&sweetAlert.close()}},l=function(e,t){var n=!0;(0,r.hasClass)(e,"show-input")&&(n=e.querySelector("input").value,n||(n="")),t.doneFunction(n),t.closeOnConfirm&&sweetAlert.close(),t.showLoaderOnConfirm&&sweetAlert.disableButtons()},i=function(e,t){var n=String(t.doneFunction).replace(/\s/g,""),o="function("===n.substring(0,9)&&")"!==n.substring(9,10);o&&t.doneFunction(!1),t.closeOnCancel&&sweetAlert.close()};o["default"]={handleButton:s,handleConfirm:l,handleCancel:i},n.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],4:[function(n,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=function(e,t){return new RegExp(" "+t+" ").test(" "+e.className+" ")},s=function(e,t){r(e,t)||(e.className+=" "+t)},l=function(e,t){var n=" "+e.className.replace(/[\t\r\n]/g," ")+" ";if(r(e,t)){for(;n.indexOf(" "+t+" ")>=0;)n=n.replace(" "+t+" "," ");e.className=n.replace(/^\s+|\s+$/g,"")}},i=function(e){var n=t.createElement("div");return n.appendChild(t.createTextNode(e)),n.innerHTML},u=function(e){e.style.opacity="",e.style.display="block"},c=function(e){if(e&&!e.length)return u(e);for(var t=0;t<e.length;++t)u(e[t])},d=function(e){e.style.opacity="",e.style.display="none"},f=function(e){if(e&&!e.length)return d(e);for(var t=0;t<e.length;++t)d(e[t])},p=function(e,t){for(var n=t.parentNode;null!==n;){if(n===e)return!0;n=n.parentNode}return!1},m=function(e){e.style.left="-9999px",e.style.display="block";var t,n=e.clientHeight;return t="undefined"!=typeof getComputedStyle?parseInt(getComputedStyle(e).getPropertyValue("padding-top"),10):parseInt(e.currentStyle.padding),e.style.left="",e.style.display="none","-"+parseInt((n+t)/2)+"px"},v=function(e,t){if(+e.style.opacity<1){t=t||16,e.style.opacity=0,e.style.display="block";var n=+new Date,o=function a(){e.style.opacity=+e.style.opacity+(new Date-n)/100,n=+new Date,+e.style.opacity<1&&setTimeout(a,t)};o()}e.style.display="block"},y=function(e,t){t=t||16,e.style.opacity=1;var n=+new Date,o=function a(){e.style.opacity=+e.style.opacity-(new Date-n)/100,n=+new Date,+e.style.opacity>0?setTimeout(a,t):e.style.display="none"};o()},b=function(n){if("function"==typeof MouseEvent){var o=new MouseEvent("click",{view:e,bubbles:!1,cancelable:!0});n.dispatchEvent(o)}else if(t.createEvent){var a=t.createEvent("MouseEvents");a.initEvent("click",!1,!1),n.dispatchEvent(a)}else t.createEventObject?n.fireEvent("onclick"):"function"==typeof n.onclick&&n.onclick()},h=function(t){"function"==typeof t.stopPropagation?(t.stopPropagation(),t.preventDefault()):e.event&&e.event.hasOwnProperty("cancelBubble")&&(e.event.cancelBubble=!0)};a.hasClass=r,a.addClass=s,a.removeClass=l,a.escapeHtml=i,a._show=u,a.show=c,a._hide=d,a.hide=f,a.isDescendant=p,a.getTopMargin=m,a.fadeIn=v,a.fadeOut=y,a.fireClick=b,a.stopEventPropagation=h},{}],5:[function(t,o,a){Object.defineProperty(a,"__esModule",{value:!0});var r=t("./handle-dom"),s=t("./handle-swal-dom"),l=function(t,o,a){var l=t||e.event,i=l.keyCode||l.which,u=a.querySelector("button.confirm"),c=a.querySelector("button.cancel"),d=a.querySelectorAll("button[tabindex]");if(-1!==[9,13,32,27].indexOf(i)){for(var f=l.target||l.srcElement,p=-1,m=0;m<d.length;m++)if(f===d[m]){p=m;break}9===i?(f=-1===p?u:p===d.length-1?d[0]:d[p+1],(0,r.stopEventPropagation)(l),f.focus(),o.confirmButtonColor&&(0,s.setFocusStyle)(f,o.confirmButtonColor)):13===i?("INPUT"===f.tagName&&(f=u,u.focus()),f=-1===p?u:n):27===i&&o.allowEscapeKey===!0?(f=c,(0,r.fireClick)(f,l)):f=n}};a["default"]=l,o.exports=a["default"]},{"./handle-dom":4,"./handle-swal-dom":6}],6:[function(n,o,a){function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(a,"__esModule",{value:!0});var s=n("./utils"),l=n("./handle-dom"),i=n("./default-params"),u=r(i),c=n("./injected-html"),d=r(c),f=".sweet-alert",p=".sweet-overlay",m=function(){var e=t.createElement("div");for(e.innerHTML=d["default"];e.firstChild;)t.body.appendChild(e.firstChild)},v=function x(){var e=t.querySelector(f);return e||(m(),e=x()),e},y=function(){var e=v();return e?e.querySelector("input"):void 0},b=function(){return t.querySelector(p)},h=function(e,t){var n=(0,s.hexToRgb)(t);e.style.boxShadow="0 0 2px rgba("+n+", 0.8), inset 0 0 0 1px rgba(0, 0, 0, 0.05)"},g=function(n){var o=v();(0,l.fadeIn)(b(),10),(0,l.show)(o),(0,l.addClass)(o,"showSweetAlert"),(0,l.removeClass)(o,"hideSweetAlert"),e.previousActiveElement=t.activeElement;var a=o.querySelector("button.confirm");a.focus(),setTimeout(function(){(0,l.addClass)(o,"visible")},500);var r=o.getAttribute("data-timer");if("null"!==r&&""!==r){var s=n;o.timeout=setTimeout(function(){var e=(s||null)&&"true"===o.getAttribute("data-has-done-function");e?s(null):sweetAlert.close()},r)}},w=function(){var e=v(),t=y();(0,l.removeClass)(e,"show-input"),t.value=u["default"].inputValue,t.setAttribute("type",u["default"].inputType),t.setAttribute("placeholder",u["default"].inputPlaceholder),C()},C=function(e){if(e&&13===e.keyCode)return!1;var t=v(),n=t.querySelector(".sa-input-error");(0,l.removeClass)(n,"show");var o=t.querySelector(".sa-error-container");(0,l.removeClass)(o,"show")},S=function(){var e=v();e.style.marginTop=(0,l.getTopMargin)(v())};a.sweetAlertInitialize=m,a.getModal=v,a.getOverlay=b,a.getInput=y,a.setFocusStyle=h,a.openModal=g,a.resetInput=w,a.resetInputError=C,a.fixVerticalPosition=S},{"./default-params":2,"./handle-dom":4,"./injected-html":7,"./utils":9}],7:[function(e,t,n){Object.defineProperty(n,"__esModule",{value:!0});var o='<div class="sweet-overlay" tabIndex="-1"></div><div class="sweet-alert"><div class="sa-icon sa-error">\n      <span class="sa-x-mark">\n        <span class="sa-line sa-left"></span>\n        <span class="sa-line sa-right"></span>\n      </span>\n    </div><div class="sa-icon sa-warning">\n      <span class="sa-body"></span>\n      <span class="sa-dot"></span>\n    </div><div class="sa-icon sa-info"></div><div class="sa-icon sa-success">\n      <span class="sa-line sa-tip"></span>\n      <span class="sa-line sa-long"></span>\n\n      <div class="sa-placeholder"></div>\n      <div class="sa-fix"></div>\n    </div><div class="sa-icon sa-custom"></div><h2>Title</h2>\n    <p>Text</p>\n    <fieldset>\n      <input type="text" tabIndex="3" />\n      <div class="sa-input-error"></div>\n    </fieldset><div class="sa-error-container">\n      <div class="icon">!</div>\n      <p>Not valid!</p>\n    </div><div class="sa-button-container">\n      <button class="cancel" tabIndex="2">Cancel</button>\n      <div class="sa-confirm-button-container">\n        <button class="confirm" tabIndex="1">OK</button><div class="la-ball-fall">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div></div>';n["default"]=o,t.exports=n["default"]},{}],8:[function(e,t,o){Object.defineProperty(o,"__esModule",{value:!0});var a=e("./utils"),r=e("./handle-swal-dom"),s=e("./handle-dom"),l=["error","warning","info","success","input","prompt"],i=function(e){var t=(0,r.getModal)(),o=t.querySelector("h2"),i=t.querySelector("p"),u=t.querySelector("button.cancel"),c=t.querySelector("button.confirm");if(o.innerHTML=e.html?e.title:(0,s.escapeHtml)(e.title).split("\n").join("<br>"),i.innerHTML=e.html?e.text:(0,s.escapeHtml)(e.text||"").split("\n").join("<br>"),e.text&&(0,s.show)(i),e.customClass)(0,s.addClass)(t,e.customClass),t.setAttribute("data-custom-class",e.customClass);else{var d=t.getAttribute("data-custom-class");(0,s.removeClass)(t,d),t.setAttribute("data-custom-class","")}if((0,s.hide)(t.querySelectorAll(".sa-icon")),e.type&&!(0,a.isIE8)()){var f=function(){for(var o=!1,a=0;a<l.length;a++)if(e.type===l[a]){o=!0;break}if(!o)return logStr("Unknown alert type: "+e.type),{v:!1};var i=["success","error","warning","info"],u=n;-1!==i.indexOf(e.type)&&(u=t.querySelector(".sa-icon.sa-"+e.type),(0,s.show)(u));var c=(0,r.getInput)();switch(e.type){case"success":(0,s.addClass)(u,"animate"),(0,s.addClass)(u.querySelector(".sa-tip"),"animateSuccessTip"),(0,s.addClass)(u.querySelector(".sa-long"),"animateSuccessLong");break;case"error":(0,s.addClass)(u,"animateErrorIcon"),(0,s.addClass)(u.querySelector(".sa-x-mark"),"animateXMark");break;case"warning":(0,s.addClass)(u,"pulseWarning"),(0,s.addClass)(u.querySelector(".sa-body"),"pulseWarningIns"),(0,s.addClass)(u.querySelector(".sa-dot"),"pulseWarningIns");break;case"input":case"prompt":c.setAttribute("type",e.inputType),c.value=e.inputValue,c.setAttribute("placeholder",e.inputPlaceholder),(0,s.addClass)(t,"show-input"),setTimeout(function(){c.focus(),c.addEventListener("keyup",swal.resetInputError)},400)}}();if("object"==typeof f)return f.v}if(e.imageUrl){var p=t.querySelector(".sa-icon.sa-custom");p.style.backgroundImage="url("+e.imageUrl+")",(0,s.show)(p);var m=80,v=80;if(e.imageSize){var y=e.imageSize.toString().split("x"),b=y[0],h=y[1];b&&h?(m=b,v=h):logStr("Parameter imageSize expects value with format WIDTHxHEIGHT, got "+e.imageSize)}p.setAttribute("style",p.getAttribute("style")+"width:"+m+"px; height:"+v+"px")}t.setAttribute("data-has-cancel-button",e.showCancelButton),e.showCancelButton?u.style.display="inline-block":(0,s.hide)(u),t.setAttribute("data-has-confirm-button",e.showConfirmButton),e.showConfirmButton?c.style.display="inline-block":(0,s.hide)(c),e.cancelButtonText&&(u.innerHTML=(0,s.escapeHtml)(e.cancelButtonText)),e.confirmButtonText&&(c.innerHTML=(0,s.escapeHtml)(e.confirmButtonText)),e.confirmButtonColor&&(c.style.backgroundColor=e.confirmButtonColor,c.style.borderLeftColor=e.confirmLoadingButtonColor,c.style.borderRightColor=e.confirmLoadingButtonColor,(0,r.setFocusStyle)(c,e.confirmButtonColor)),t.setAttribute("data-allow-outside-click",e.allowOutsideClick);var g=!!e.doneFunction;t.setAttribute("data-has-done-function",g),e.animation?"string"==typeof e.animation?t.setAttribute("data-animation",e.animation):t.setAttribute("data-animation","pop"):t.setAttribute("data-animation","none"),t.setAttribute("data-timer",e.timer)};o["default"]=i,t.exports=o["default"]},{"./handle-dom":4,"./handle-swal-dom":6,"./utils":9}],9:[function(t,n,o){Object.defineProperty(o,"__esModule",{value:!0});var a=function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e},r=function(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?parseInt(t[1],16)+", "+parseInt(t[2],16)+", "+parseInt(t[3],16):null},s=function(){return e.attachEvent&&!e.addEventListener},l=function(t){"undefined"!=typeof e&&e.console&&e.console.log("SweetAlert: "+t)},i=function(e,t){e=String(e).replace(/[^0-9a-f]/gi,""),e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),t=t||0;var n,o,a="#";for(o=0;3>o;o++)n=parseInt(e.substr(2*o,2),16),n=Math.round(Math.min(Math.max(0,n+n*t),255)).toString(16),a+=("00"+n).substr(n.length);return a};o.extend=a,o.hexToRgb=r,o.isIE8=s,o.logStr=l,o.colorLuminance=i},{}]},{},[1]),"function"==typeof define&&define.amd?define(function(){return sweetAlert}):"undefined"!=typeof module&&module.exports&&(module.exports=sweetAlert)}(window,document);
/**
 * Валидация почты
 * @return {boolean}
 */
String.prototype.isEmail = function() {
    var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    return regexp.test(this);
};


/**
 * Содержит ли строка подстроку
 * @returns {boolean}
 */
String.prototype.testName = function() {
    return (this === "") || (this.search(arguments[0]) > -1);
};


/**
 * Нормализуем строку для поиска
 * @returns {String}
 */
String.prototype.normalizeForSearch = function() {
    var string = this;
    string = string.toLowerCase().trim();
    string = string.replace(/ё/g, 'е');
    string = string.replace(/\s+/g, ' ');
    string = string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    return string;
};


/**
 * Punto Switcher
 * @returns {string}
 */
String.prototype.punto = function() {
    var charsArray = {
        'q':'й',
        'w':'ц',
        'e':'у',
        'r':'к',
        't':'е',
        '`':'е',
        'y':'н',
        'u':'г',
        'i':'ш',
        'o':'щ',
        'p':'з',
        '[':'х',
        ']':'ъ',
        'a':'ф',
        's':'ы',
        'd':'в',
        'f':'а',
        'g':'п',
        'h':'р',
        'j':'о',
        'k':'л',
        'l':'д',
        ';':'ж',
        '\'':'э',
        'z':'я',
        'x':'ч',
        'c':'с',
        'v':'м',
        'b':'и',
        'n':'т',
        'm':'ь',
        ',':'б',
        '.':'ю',
        '/':'.'
    };

    var converted = "",
        i,
        char;

    for (i=0; i<this.length; i++) {
        char = this.charAt(i);
        converted += (char in charsArray) ? charsArray[char] : char;
    }

    return converted;
};

(function( $, window, document ){

    var $w = $(window),
        $b = $('body'),
        $d = $(document),
        homeSliderInitialized = false;

    frontpage();
    hamburger();
    calculator();
    galleries();
    popups();
    map();
    appointment();
    $w.trigger('resize');


    /**
     * Слайдер на главной странице
     */
    function frontpage() {
        $(".js-frontpage-mega-gallery")
            .on('init', function( slick ){
                try {
                    var headers = slick.currentTarget.querySelectorAll('h2'),
                        buttons = slick.currentTarget.querySelector('.fp-gallery__dots').querySelectorAll('button');

                    for (var i=0; i<headers.length; i++) {
                        buttons[i].innerHTML = headers[i].innerHTML;
                    }
                } catch (err) {

                }
            })
            .slick({
                dots: true,
                dotsClass: 'fp-gallery__dots',
                infinite: false,
                speed: 300,
                centerMode: true,
                variableWidth: true,
                prevArrow: '<button class="fp-gallery__prev"></button>',
                nextArrow: '<button class="fp-gallery__next"></button>',
                responsive: [
                    {
                        breakpoint: 800,
                        settings: {
                            variableWidth: false,
                            dots: false
                        }
                    }
                ]
            });

        $(".js-testimonials")
            .slick({
                dots: true,
                dotsClass: 'testimonials__dots',
                infinite: true,
                speed: 300,
                adaptiveHeight: true,
                prevArrow: '<button class="testimonials__prev"></button>',
                nextArrow: '<button class="testimonials__next"></button>'
            });
    }

    /**
     * Кнопка вызова меню на мобильном устройстве
     */
    function hamburger() {
        $('.js-hamburger').click(function(){
            $b.toggleClass('show-menu');
        });

        $('.js-mobile-menu-close').click(function( event ){
            $b.removeClass('show-menu');
        });
    }


    /**
     * Галереи
     */
    function galleries() {
        $('.js-room-gallery').royalSlider({
            controlNavigation: 'thumbnails',
            autoScaleSlider: false,
            arrowsNav: false,
            thumbs: {
                fitInViewport: true,
                appendSpan: true,
                firstMargin: true,
                arrowsAutoHide: true
            },
            fullscreen: {
                enabled: true,
                nativeFS: true
            }
        });

        $('.js-page-gallery').royalSlider({
            addActiveClass: true,
            loop: true,
            controlNavigation: 'none',
            autoScaleSlider: false,
            arrowsNav: false,
            fadeinLoadedSlide: false,
            visibleNearby: {
                enabled: true,
                centerArea: 0.4,
                center: true,
                breakpoint: 650,
                breakpointCenterArea: 0.64,
                navigateByCenterClick: true
            },
            fullscreen: {
                enabled: true,
                nativeFS: true
            }
        });
    }


    /**
     * Калькулятор стоимости
     */
    function calculator() {
        var $calc = $(".js-calculator").first(),
            $tour = $calc.find('.js-tour-select').first(),
            $room = $calc.find('.js-room-select').first(),
            $alone = $calc.find('.js-alone'),
            $comment = $calc.find('.js-comment').first(),
            $duration = $('.js-duration-select'),
            $start = $calc.find('.js-start-select').first(),
            $price = $calc.find('.js-price').first(),
            fixed_tour = typeof _FIXED_TOUR_ID !== 'undefined' ? _FIXED_TOUR_ID : null,
            fixed_room = typeof _FIXED_ROOM_ID !== 'undefined' ? _FIXED_ROOM_ID : null,
            i;

        if (typeof _TOURS_ === 'undefined' || typeof _ROOMS_ === 'undefined') {
            $calc.hide();
            $duration.hide();
            return;
        }

        $('.js-stick').stick_in_parent();
        $start.datepicker({
            language: 'ru-RU',
            autoHide: true,
            inline: true,
            container: '.js-start-container'
        });

        // Заполняем калькулятор данными по номерам
        for (i=0; i<_ROOMS_.length; i++) {
            $room.append('<option value="' + _ROOMS_[i].id + '">' + _ROOMS_[i].title + '</option>');
            if (_ROOMS_[i].id == fixed_room) {
                $room.prop('disabled', true);
                $room.val(fixed_room);
            }
        }

        // Заполняем калькулятор данными по путёвкам
        for (i=0; i<_TOURS_.length; i++) {
            $tour.append('<option value="' + _TOURS_[i].id + '">' + _TOURS_[i].title + '</option>');
            if (_TOURS_[i].id == fixed_tour) {
                $tour.prop('disabled', true);
                $tour.val(fixed_tour);
            }
        }

        // Заполняем дату заезда - завтра
        var tomorrow = moment().add(1, 'd');
        $start.datepicker('setStartDate', tomorrow.format('DD/MM/YYYY'));
        $start.datepicker('setDate', tomorrow.format('DD/MM/YYYY'));

        // Пересчитать стоимость
        function recalc() {
            var current_tour = $tour.val(),
                current_room = $room.val(),
                current_duration = parseInt($duration.first().val()),
                current_start = $start.val(),
                alone = $alone.is(':checked'),
                i, j, item,
                total_price = null;

            // Проходим все путёвки
            for (i=0; i<_TOURS_.length; i++) {
                if (_TOURS_[i].id == current_tour) {
                    var start_price,
                        end_price,
                        change_date,
                        start_date = moment(current_start, 'DD/MM/YYYY'),
                        end_date = start_date.clone().add(current_duration, 'd'),
                        from, to;

                    // Проходим весь прайслист найденной путёвки
                    for (j=0; j<_TOURS_[i].prices.length; j++) {
                        item = _TOURS_[i].prices[j];
                        from = moment(item.from, 'YYYY-MM-DD');
                        to = moment(item.to, 'YYYY-MM-DD');

                        if (item.room == current_room && item.alone === alone ) {
                            if (start_date.isBetween(from, to, null, '[]')) {
                                start_price = item.price;
                                change_date = to.clone();
                            }
                            if (end_date.isBetween(from, to, null, '[]')) {
                                end_price = item.price;
                            }
                        }
                    }
                }
            }

            var duration1 = change_date.diff(start_date, 'd') + 1,
                duration2 = end_date.diff(change_date, 'd') - 1;
            total_price = duration1 * start_price + duration2 * end_price;

            if ( isNaN(total_price) ) {
                $price.html('Ошибка');
            } else {
                $price.html(total_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' руб.');
            }
        } // update()

        // Задать ограничение на выбор даты заезда
        function limitStart() {
            var current_tour = $tour.val(),
                current_room = $room.val(),
                current_duration = parseInt($duration.first().val()),
                current_limit = moment(),
                i, j, item,
                total_price = null;

            for (i=0; i<_TOURS_.length; i++) {
                if (_TOURS_[i].id == current_tour) {
                    // Проходим весь прайслист найденной путёвки
                    for (j=0; j<_TOURS_[i].prices.length; j++) {
                        item = _TOURS_[i].prices[j];
                        if (item.room == current_room ) {
                            var limit = moment(item.to, 'YYYY-MM-DD').subtract(current_duration, 'd');
                            current_limit = moment.max(current_limit, limit);
                        }
                    }
                }
            }

            $start.datepicker('setEndDate', current_limit.format('DD/MM/YYYY'));
        }

        // Смена путёвки
        $tour.change(function(){
            var current_tour = $tour.val(),
                i, j;

            $duration.html('');

            for (i=0; i<_TOURS_.length; i++) {
                if (_TOURS_[i].id == current_tour) {
                    for (j=0; j<_TOURS_[i].durations.length; j++) {
                        var duration = _TOURS_[i].durations[j];
                        $duration.append('<option value="' + _TOURS_[i].durations[j] + '">' + duration + ' ' + declOfNum(duration, ['день', 'дня', 'дней']) + '</option>');
                    }
                }
            }

            $duration.change();
        });

        // Смена длительности проживания
        $duration.change(function(){
            var duration = $(this).val();
            // скрываем все таблицы
            $(".js-services-table").addClass('hidden');
            // показываем таблицу с выбранной продолжительностью
            $('#duration-' + duration ).removeClass('hidden');
            // изменяем значение всех селекторов, где есть выбор длительности
            $duration.val( duration );
            recalc();
            limitStart();
        });

        // Смена даты заезда
        $start.change(function(){
            recalc();
        });

        // Смена номера
        $room.change(function(){
            var current_room = $room.val();
            recalc();

            $comment.html('');
            $alone.prop('disabled', false);
            for (i=0; i<_ROOMS_.length; i++) {
                if (_ROOMS_[i].id == current_room) {
                    $comment.html(_ROOMS_[i].comment);
                    if (_ROOMS_[i].max_persons < 2) {
                        $alone.prop('disabled', true).prop('checked', true);
                    }
                }
            }
        });

        // Смена галочки "Я хочу жить один"
        $alone.change(function(){
            recalc();
        });

        $tour.trigger('change');
        $room.trigger('change');
    }


    /**
     * Виджет персонала
     * Если все карточки не влезают на одну строку - скрываем все остальные и показываем кнопку "Показать всех специалистов"
     * Если влезает одна карточка - значит мобильное устройство, ничего не скрываем
     */
    function staff() {
        var items = [];

        $('.js-staff').each(function(){
            var $this = $(this),
                $container = $this.find(".js-staff-items").first(),
                $button = $this.find(".js-staff-button").first();

            items.push({
                $container: $container,
                $button: $button,
                expanded: false,
                items: []
            });

            $container.css('overflow-y', 'hidden');
            $button
                .data('staff-id', items.length - 1)
                .click(function(){
                    var $this = $(this),
                        staffId = $this.data('staff-id');

                    items[staffId].expanded = true;
                    items[staffId].$button.hide();
                    items[staffId].$container.css('max-height', '5000px');
                });


            $container.children().each(function(){
                items[items.length-1].items.push( $(this) );
            });
        });

        function recalc() {
            for (var i=0; i<items.length; i++) {
                var $container = items[i].$container,
                    $button = items[i].$button,
                    gallery = items[i].items,
                    expanded = items[i].expanded,
                    offsetTop = 0,
                    maxHeight = 0,
                    all = 0,
                    oneRowItems = 0,
                    mobile = $container.css('white-space') === 'nowrap';

                // Если на мобильном устройстве
                if (mobile) {
                    $container.css('max-height', 'none');
                    $button.hide();
                }
                // Если кнопка "Показать всё" ещё не нажата
                else if (!expanded) {
                    for (var k=0; k<gallery.length; k++) {
                        var $this = gallery[k],
                            height = $this.outerHeight( true );

                        if ( $this.is(":visible") ) {
                            all++;

                            offsetTop = offsetTop === 0 ? $this.offset().top : offsetTop;
                            maxHeight = maxHeight === 0 ? $this.outerHeight() : maxHeight;

                            if ( $this.offset().top === offsetTop ) {
                                oneRowItems++;
                                maxHeight = Math.max(maxHeight, height);
                            }
                        }
                    }

                    if (all > oneRowItems) {
                        $button.show();
                        $container.css('max-height', maxHeight);
                    } else {
                        $button.hide();
                        $container.css('max-height', 'none');
                    }
                }
            }
        }

        $(window).resize(function(){
            recalc();
        });
    }


    /**
     * Всплывающие окна
     */
    function popups() {
        $(".js-open-calculator").magnificPopup({
            preload: false,
            fixedBgPos: true,
            overflowY: 'auto',
            fixedContentPos: true,
            mainClass: 'show',
            callbacks: {
                beforeOpen: function() {
                    $b.removeClass('show-menu');
                    $(".js-stick").trigger("sticky_kit:detach");
                },
                open: function(){
                },
                beforeClose: function() {
                }
            }
        });

        $(".js-show-popup").magnificPopup({
            preload: false,
            fixedContentPos: true,
            fixedBgPos: true,
            overflowY: 'auto',
            removalDelay: 300,
            mainClass: 'my-mfp-zoom-in',
            callbacks: {
                beforeOpen: function() {
                    $b.removeClass('show-menu');
                },
                open: function(){
                    var $button = $(this.st.el),
                        $form = this.content,
                        target = $button.data('target');

                    $form.find("input[name='target']").val( target );
                },
                beforeClose: function() {
                }
            }
        });
    }


    /**
     * Формы записи на приём
     */
    function appointment() {
        var $forms = $(".js-form"),
            SITE_TEMPLATE_PATH = typeof SITE_TEMPLATE_PATH !== 'undefined' ? SITE_TEMPLATE_PATH : '';

        /* Проверить корректность имени */
        function checkName( $form ) {
            var $name = $form.find("input[name='name']"),
                value;

            if ($name.length === 0) return null;

            value = $name.first().val();

            if (value.length < 3)
                return {
                    options: {
                        title: 'Ой!',
                        text: 'Представьтесь, пожалуйста!',
                        type: 'warning'
                    },
                    $obj: $name
                };

            return null;
        }

        /* Проверить корректность телефона */
        function checkPhone( $form ) {
            var $phone = $form.find("input[name='phone']"),
                value,
                digits;

            if ($phone.length === 0) return null;

            value = $phone.first().val();
            digits = value.replace(/\D/g, '');

            // Не указан телефон
            if (digits.length === 0)
                return {
                    options: {
                        title: 'Ой!',
                        text: 'Оставьте, пожалуйста, свой телефон.',
                        type: 'warning'
                    },
                    $obj: $phone
                };

            // В телефоне указаны не все цифры
            if (digits.length < 11)
                return {
                    options: {
                        title: 'Ой!',
                        text: 'Вы указали не все цифры в телефоне.',
                        type: 'warning'
                    },
                    $obj: $phone
                };

            return null;
        }

        /* Проверить корректность почты */
        function checkEmail( $form ) {
            var $email = $form.find("input[name='email']"),
                value;


            if ($email.length === 0) return null;

            value = $email.first().val();

            // Не указан телефон
            if (value === '')
                return {
                    options: {
                        title: 'Ой!',
                        text: 'Укажите, пожалуйста, свою электронную почту.',
                        type: 'warning'
                    },
                    $obj: $email
                };

            // В телефоне указаны не все цифры
            if (!value.isEmail())
                return {
                    options: {
                        title: 'Ой!',
                        text: 'Вы указали некорректный почтовый адрес.',
                        type: 'warning'
                    },
                    $obj: $email
                };

            return null;
        }

        // Маска телефона
        $forms.find("input[name='phone']").mask('+9 999 999-99-99', {autoclear: false});

        // Добавляем элементы для анимации во время отправки формы
        $forms.find("button").append('<span class="la-ball-fall"><span></span><span></span><span></span></span>').prop('disabled', false);

        // Отправка формы
        $forms.submit(function( e ){
            var $this = $(this),
                url = SITE_TEMPLATE_PATH + $this.prop('action'),
                successMessage = $this.data('success'),
                $legal = $this.find("input[name='legal']").first(),
                $submit = $this.find("button").first(),
                error = null;

            e.preventDefault();

            error = error === null ? checkName( $this ) : error;
            error = error === null ? checkPhone( $this ) : error;
            error = error === null ? checkEmail( $this ) : error;

            // Не отмечена галочка "Я прочитал..."
            if ( !$legal.is(':checked') && error === null ) {
                error = {
                    options: {
                        title: 'Ой!',
                        text: 'Вы не дали согласие на обработку персональных данных.',
                        type: 'warning'
                    }
                };
            }

            // Ошибка в форме
            if (error) {
                swal(
                    error.options,
                    function(){
                        if (error.$obj)
                            setTimeout(
                                function(){
                                    error.$obj.focus();
                                },
                                10
                            )
                    }
                );
            }
            // Отправка запроса на сервер
            else {
                $submit.prop('disabled', true).addClass('loading');

                $.ajax({
                    type: 'POST',
                    url: url,
                    data: $this.serialize()
                })
                    .done(function( response ){
                        try {
                            var data = JSON.parse(response);

                            if (data.SUCCESS) {
                                swal('Отлично!', successMessage, 'success');
                            } else {
                                swal('Ой!', 'Что-то пошло не так. Программисты уже разбираются. Запишитесь, пожалуйста, по телефону.', 'error');
                            }
                        } catch(e) {
                            swal('Ой!', 'Что-то пошло не так. Программисты уже разбираются. Запишитесь, пожалуйста, по телефону.', 'error');
                        }
                    })
                    .fail(function(){
                        swal('Ой!', 'Что-то пошло не так. Программисты уже разбираются. Запишитесь, пожалуйста, по телефону.', 'error');
                    })
                    .always(function(){
                        $submit.prop('disabled', false).removeClass('loading');
                        $.magnificPopup.close();
                    });
            }
        });
    }


    /**
     * Карта в контактах
     */
    function map() {
        var id = 'map',
            $map = $( '#' + id );

        if ( $map.length && $map.is(':visible') ) ymaps.ready(init);

        function init() {
            var coords = $map.data('coords').split(','),
                zoom = $map.data('zoom'),
                map = new ymaps.Map(id, {
                    center: coords,
                    zoom: zoom,
                    controls: ['zoomControl']
                }),
                marker = new ymaps.Placemark(coords, {}, {
                    iconLayout: 'default#image',
                    iconImageHref: '/img/marker.png',
                    iconImageSize: [59, 72],
                    iconImageOffset: [-30, -72]
                });

            map.geoObjects.add(marker);
        }
    }


    /**
     * Моментальный поиск на странице без перезагрузки
     */
    function instantSearch() {
        var $data = $(".js-instant-search-data"),
            data = [],
            $search = $(".js-instant-search").first();

        // Сохраняем данные в массив
        $data.children().each(function(){
            var fields = [
                    '.staff__item__name',
                    '.staff__item__position',
                    '.pricelist__item__title',
                    '.pricelist__item__description'
                ],
                values,
                $item = $(this);

            values = fields.map(function( value ){
                return $item.find( value ).first().text().normalizeForSearch()
            });

            data.push({
                data: values.join(' ').trim(),
                $item: $item
            });
        });

        // Обработчик события изменения поля ввода
        $search.on('propertychange input', function(){
            var searchText = $search.val().normalizeForSearch(),
                words = searchText.split(' '),
                found,
                word,
                wordPunto,
                i, j;

            for (i=0; i<data.length; i++) {
                found = 0;

                for (j=0; j<words.length; j++) {
                    word = words[j];
                    wordPunto = word.punto();

                    if (data[i].data.testName(word) || data[i].data.testName(wordPunto)) {
                        found++;
                    }
                }

                if (found === words.length) {
                    data[i].$item.removeClass('hide-by-search');
                }
                else {
                    data[i].$item.addClass('hide-by-search');
                }
            }
        });
    }


    function declOfNum(number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }
})( jQuery, window, document );