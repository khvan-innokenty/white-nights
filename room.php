<?php include "header.php"; ?>

<div class="header__wrapper">
    <div class="container">
        <?php include_once "menu-inner-page.php" ?>
    </div>
</div>

    <div class="content">
        <div class="container top-gap bottom-gap">
            <ul class="breadcrumbs">
                <li><a href="/">Главная</a></li><li><a href="/rooms.php">Проживание</a></li><li>Однокомнатный двухместный «СТАНДАРТ»</li>
            </ul>
            <h1>Однокомнатный двухместный «СТАНДАРТ»</h1>

            <div class="block-with-calculator cf">
                <div class="block-with-calculator__calculator">
                    <?php include_once "calculator.php"; ?>
                    <script> var _FIXED_ROOM_ID = 101; </script>
                </div>
                <div class="block-with-calculator__content">
                    <div class="royalSlider rsDefault room__gallery js-room-gallery">
                        <a class="rsImg" href="/img/rooms-1.jpg" data-rsTmb="/img/rooms-1-thumb.jpg"></a>
                        <a class="rsImg" href="/img/rooms-1-bath.jpg" data-rsTmb="/img/rooms-1-bath-thumb.jpg"></a>
                        <a class="rsImg" href="/img/rooms-1-plan.jpg" data-rsTmb="/img/rooms-1-plan-thumb.jpg"></a>
                        <a class="rsImg" href="/img/rooms-1-plan.jpg" data-rsTmb="/img/rooms-1-plan-thumb.jpg"></a>
                        <a class="rsImg" href="/img/rooms-1-plan.jpg" data-rsTmb="/img/rooms-1-plan-thumb.jpg"></a>
                        <a class="rsImg" href="/img/rooms-1-plan.jpg" data-rsTmb="/img/rooms-1-plan-thumb.jpg"></a>
                        <a class="rsImg" href="/img/rooms-1-plan.jpg" data-rsTmb="/img/rooms-1-plan-thumb.jpg"></a>
                        <a class="rsImg" href="/img/rooms-1-plan.jpg" data-rsTmb="/img/rooms-1-plan-thumb.jpg"></a>
                        <a class="rsImg" href="/img/rooms-1-plan.jpg" data-rsTmb="/img/rooms-1-plan-thumb.jpg"></a>
                    </div>

                    <div class="room-description">
                        <div class="room__table">
                            <div class="room__table__cell">
                                <div class="room__title">Площадь:</div>
                                <div class="room__value">26.3 м&sup2;</div>
                            </div>
                            <div class="room__table__cell">
                                <div class="room__title">Количество комнат:</div>
                                <div class="room__value">1</div>
                            </div>
                        </div>

                        <div class="room__table">
                            <div class="room__table__cell">
                                <div class="room__title">Вместимость:</div>
                                <div class="room__value">
                                    2 основных места.<br>
                                    2 дополнительных места.
                                </div>
                            </div>
                            <div class="room__table__cell">
                                <div class="room__title">Размещение:</div>
                                <div class="room__value">
                                    2 односпальные полуторные кровати или 1 двуспальная кровать.
                                </div>
                            </div>
                        </div>

                        <div class="room__title">В каждом номере есть:</div>
                        <ul class="room__list">
                            <li><img src="/img/icons/rooms/refrigirator.svg"> Холодильник</li>
                            <li><img src="/img/icons/rooms/phone.svg"> Телефон</li>
                            <li><img src="/img/icons/rooms/hair-dryer.svg"> Фен</li>
                            <li><img src="/img/icons/rooms/tv.svg"> Телевизор (кабельное TV)</li>
                            <li><img src="/img/icons/rooms/wifi.svg"> Интернет до 10 Мбит/сек</li>
                        </ul>
                    </div>
                </div>
            </div>

            <a class="button button--full-width calculator__show-button js-open-calculator" href="#calculator">Рассчитать стоимость</a>

        </div>

        <div class="brothers__wrapper">
            <div class="brothers__header">Смотрите ещё:</div>
            <ul class="brothers">
                <li>
                    <a class="brothers__item" style="background-image: url('/img/rooms-2.jpg')" href="/room.php">
                        <span class="brothers__item__title">Однокомнатный двухместный «СТАНДАРТ»</span>
                    </a>
                </li>
                <li>
                    <a class="brothers__item" style="background-image: url('/img/rooms-3.jpg')" href="/room.php">
                        <span class="brothers__item__title">Двухкомнатный «ЛЮКС»</span>
                    </a>
                </li>
                <li>
                    <a class="brothers__item" style="background-image: url('/img/rooms-4.jpg')" href="/room.php">
                        <span class="brothers__item__title">Трёхкомнатный «ЛЮКС»</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>

<?php include "footer.php";