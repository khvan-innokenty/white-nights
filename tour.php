<?php include "header.php"; ?>

<div class="header__wrapper">
    <div class="container">
        <?php include_once "menu-inner-page.php" ?>
    </div>
</div>

    <div class="content">
        <div class="page-hero__wrapper" style="background-image: url('/img/tour-hero.jpg')">
            <div class="page-hero">
                <div class="container">
                    <ul class="breadcrumbs">
                        <li><a href="/">Главная</a></li><li><a href="/tours.php">Путёвки</a></li><li>Идеальный вес</li>
                    </ul>
                    <h1 class="page-hero__header">Идеальный вес</h1>
                    <div class="page-hero__description">
                        <p>Профилактика и снижение рисков развития осложнений пищеварительной системы: расстройство приема пищи, избыточный вес и ожирение, нарушение обмена веществ.</p>
                        <p>Восстановление и отдых</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="container top-gap bottom-gap">
            <a class="button button--full-width calculator__show-button js-open-calculator" href="#calculator">Открыть калькулятор</a>

            <div class="block-with-calculator cf">
                <div class="block-with-calculator__calculator">
                    <?php include_once "calculator.php"; ?>
                    <script> var _FIXED_TOUR_ID = 1001; </script>
                </div>
                <div class="block-with-calculator__content">
                    <h2>Что входит в стоимость</h2>
                    <p>Проживание в номере выбранной категории. Во всех номерах есть: кабельное ТВ, телефон, фен, холодильник, а также бесплатный доступ в Интернет в общественных местах.</p>
                    <p>Сбалансированное диетическое 5-разовое питание (завтрак, обед, полдник, ужин + диетический напиток) согласно медицинским показаниям и задачам программы.</p>
                    <p>Культурная программа мероприятий для отдыхающих согласно календарному плану.</p>
                    <h3>Процедуры за
                        <select name="duration" class="header__select js-duration-select">
                        </select>
                    </h3>
                    <div class="services js-services-table" id="duration-10">
                        <div class="services__row">
                            <div class="services__title">Осмотр лечащего врача</div>
                            <div class="services__duration">5</div>
                        </div>
                        <div class="services__row">
                            <div class="services__title"><a href="#">Диагностика</a>: ЭКГ</div>
                            <div class="services__duration">1</div>
                        </div>
                        <div class="services__row">
                            <div class="services__title"><a href="#">Бассейн</a>: свободное плавание</div>
                            <div class="services__duration">ежедневно</div>
                        </div>
                    </div>
                    <div class="services js-services-table hidden" id="duration-14">
                        <div class="services__row">
                            <div class="services__title">Осмотр лечащего врача</div>
                            <div class="services__duration">6</div>
                        </div>
                        <div class="services__row">
                            <div class="services__title"><a href="#">Диагонстика</a>: ЭКГ</div>
                            <div class="services__duration">1</div>
                        </div>
                        <div class="services__row">
                            <div class="services__title"><a href="#">Бассейн</a>: свободное плавание</div>
                            <div class="services__duration">ежедневно</div>
                        </div>
                        <div class="services__row">
                            <div class="services__title">Карбокситерапия: контролируемое подкожное введения очищенного углекислого газа</div>
                            <div class="services__duration">2</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php include "footer.php";