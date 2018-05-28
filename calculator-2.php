<?php include "header.php"; ?>

<div class="header__wrapper">
    <div class="container">
        <?php include_once "menu-inner-page.php" ?>
    </div>
</div>

    <div class="content">
        <div class="container top-gap bottom-gap">
            <div class="dp__container js-datepicker">
                <ul class="dp__header cf">
                    <li class="prev">←</li><li class="next">→</li><li class="title"></li>
                </ul>
                <ul class="dp__title cf">
                    <li>Пн</li><li>Вт</li><li>Ср</li><li>Чт</li><li>Пт</li><li>Сб</li><li>Вс</li>
                </ul>
                <ul class="dp__matrix cf days">
                </ul>
            </div>
        </div>
    </div>

<?php include "footer.php"; ?>

<script>
    var from = new Date(2018, 2, 1),
        to = new Date(2018, 2, 31);
    $.sogazDatePicker.addPeriod(from.getTime(), to.getTime(), 5800);

    from = new Date(2018, 3, 1);
    to = new Date(2018, 7, 31);
    $.sogazDatePicker.addPeriod(from.getTime(), to.getTime(), 5200);
    $.sogazDatePicker.setDuration(6);
</script>