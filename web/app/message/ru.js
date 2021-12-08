'use strict';
/**
 * Extend default translations
 *
 * Use: Jam.t('Some text')
 * Use: <span data-t="">Some text</span>
 * Use: <div title="Some text" data-t=""></div>
 * Use: <input placeholder="Some text" type="text" data-t="">
 */
Object.assign(Jam.I18n.defaults, {

    'Test utility': 'Тестовая утилита'
});

/**
 * Define custom translation category
 *
 * Use: Jam.t('Some text', 'custom')
 * Use: <span data-t="custom">Some text</span>
 * Use: <div title="Some text" data-t="custom"></div>
 * Use: <input placeholder="Some text" type="text" data-t="custom">
 * Use: <div title="Some text" data-t-title="custom" data-t="">Text</div>
 */
Jam.I18n.custom = {

    'Some text': 'Некоторый текст'
};

// METADATA

Jam.I18n.meta = {

    'Active': 'Активно',
    'All requests': 'Все запросы',
    'Approve': 'Одобрить',
    'Approved': 'Одобрено',
    'Are you sure you want to reject this request?': 'Вы уверены, что хотите отклонить этот запрос?',
    'Are you sure you want to reopen this request?': 'Вы уверены, что хотите возобновить этот запрос?',

    'Brief': 'Краткое описание',

    'Class': 'Класс',
    'Comment': 'Комментарий',
    'Comments': 'Комментарии',
    'Create': 'Создать',
    'Create comment': 'Создать комментарий',
    'Created at': 'Создано',
    'Creator': 'Создатель',

    'Date of birth': 'Дата рождения',
    'Description': 'Описание',
    'Document': 'Документ',
    'Documents': 'Документы',
    'Draft': 'Черновик',
    'Driver license': 'Водительские права',

    'Edit comment': 'Редактировать комментарий',
    'Environmental violation': 'Эконарушения',
    'Event': 'Событие',

    'File': 'Файл',
    'First name': 'Имя',
    'Form': 'Форма',

    'Health insurance': 'Медицинская страховка',

    'Icon': 'Иконка',

    'Last name': 'Фамилия',

    'Medical history': 'История болезни',
    'Message': 'Сообщение',

    'Name': 'Название',

    'Pending': 'В ожидании рассмотрения',
    'Pistol': 'Пистолет',

    'Reason': 'Причина',
    'Reject': 'Отказать',
    'Rejected': 'Отказано',
    'Reopen': 'Переоткрыть',
    'Request': 'Запрос',
    'Request class': 'Класс запроса',
    'Requests': 'Запросы',
    'Rifle': 'Винтовка',

    'Send result by email': 'Отправить результат на электронный адрес',
    'Service': 'Услуга',
    'Shooting range': 'Стрельбище',
    'Shotgun': 'Дробовик',
    'Size': 'Размер',
    'Social number': 'Соцномер',
    'Social security number': 'Социальный номер',
    'State': 'Состояние',
    'Submit': 'Отправить',

    'Type': 'Тип',

    'Weapon': 'Оружие',
};

Jam.I18n['meta.class.request'] = {
};