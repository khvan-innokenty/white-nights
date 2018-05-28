<?php include_once "pricelist.php"; ?>

<div class="calculator js-calculator" id="calculator">
    <div class="calculator__header">Калькулятор</div>

    <label class="calculator__label" for="calculator-tour">Путёвка&nbsp;<a href="/tours.php" target="_blank" class="with-icon" title="Подробнее о путёвках"><img src="/img/icons/help.svg"></a></label>
    <select name="tour" id="calculator-tour" class="calculator__input js-tour-select"></select>

    <label class="calculator__label" for="calculator-room">Категория номера&nbsp;<a href="/rooms.php" target="_blank" class="with-icon" title="Подробнее о номерах"><img src="/img/icons/help.svg"></a></label>
    <select name="room" id="calculator-room" class="calculator__input js-room-select"></select>

    <div class="calculator__comment js-comment"></div>

    <div class="calculator__checkbox">
        <input type="checkbox" class="checkbox js-alone" name="alone" id="calculator-alone" checked><label class="checkbox__label white" for="calculator-alone">Я хочу жить один</label>
    </div>

    <label class="calculator__label" for="calculator-duration">Количество дней</label>
    <select name="duration" id="calculator-duration" class="calculator__input js-duration-select"></select>

    <label class="calculator__label" for="calculator-start">Дата заезда</label>
    <div class="dp__container js-datepicker">
        <ul class="dp__header cf">
            <li class="prev">←</li><li class="next">→</li><li class="title"></li>
        </ul>
        <ul class="dp__title cf">
            <li>Пн</li><li>Вт</li><li>Ср</li><li>Чт</li><li>Пт</li><li>Сб</li><li>Вс</li>
        </ul>
        <ul class="dp__matrix cf days"></ul>
    </div>

    <div class="calculator__price__title">Стоимость на человека</div>
    <div class="calculator__price js-price">&nbsp;</div>
    <div class="calculator__disclaimer">Не является публичной офертой</div>

    <button class="button button--secondary button--full-width">Подобрать варианты</button>
</div>