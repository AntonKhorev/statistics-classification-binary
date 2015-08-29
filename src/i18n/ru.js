// возможные источники терминологии:
// http://www.machinelearning.ru
// https://yandexdataschool.ru/edu-process/courses/machine-learning

// точность (accuracy) aka верность, достоверность, правильность; precision тоже называют точностью
// http://www.intuit.ru/studies/courses/6/6/lecture/176?page=5&keyword_content=%D1%82%D0%BE%D1%87%D0%BD%D0%BE%D1%81%D1%82%D1%8C
//	"точность (процент корректно классифицированных наблюдений)"
// http://gis-lab.info/qa/error-matrix.html
//	тоже за "точность"

i18ns.data.ru={
	// header
	'Binary classification':'Бинарная классификация',
	// models
	'model.baseline':'Базовый метод', // [?]
	'model.logreg':'[[Логистическая регрессия]]',
	'model.cart.prob':'[[Дерево принятия решений|Регрессионное дерево]]',
	'model.cart.class':'[[Дерево принятия решений|Классификационное дерево]]',
	'model.forest':'[[Random forest|Случайный лес]]',
	// input labels
	'options.code.filename':'Имя входного файла',
	'options.code.postprocess':'Код для обработки данных',
	'options.code.formula':'Формула',
	'options.code.split':'Деление на обучающую/тестовую выборку',
	'options.code.splitConditionalCondition':'Условие попадания в обучающую выборку',
	'options.code.splitRandomSeed':'Инициализация (seed) деления на выборки', // http://www.machinelearning.ru/wiki/index.php?title=%D0%92%D1%8B%D0%B1%D0%BE%D1%80%D0%BA%D0%B0
	'options.code.splitRandomRatio':'Доля обучающей выборки при делении',
	'options.code.threshold':'Порог на вероятность для классификации',
	'options.code.threshold.title':'При значениях 0 и 1 вероятности и AUC&#39;и вычисляться не будут',
	'options.code.forestSeed':'Инициализация (seed) случайного леса',
	'Reset options':'Сбросить настройки',
	// code comments
	'comment.data':'загрузка данных',
	'comment.postprocess':'обработка данных',
	'comment.split':'деление данных на обучающую/тестовую выборку',
	'comment.data.model':'построение модели',
	'comment.data.prob':'предсказание вероятностей на выборке',
	'comment.data.train.prob':'предсказание вероятностей на обучающей выборке',
	'comment.data.test.prob':'предсказание вероятностей на тестовой выборке',
	'comment.data.class':'предсказание классов на выборке',
	'comment.data.train.class':'предсказание классов на обучающей выборке',
	'comment.data.test.class':'предсказание классов на тестовой выборке',
	'comment.data.acc':'точность (accuracy) на выборке',
	'comment.data.train.acc':'точность (accuracy) на обучающей выборке',
	'comment.data.test.acc':'точность (accuracy) на тестовой выборке',
	'comment.data.auc':'[[ROC-кривая#.D0.9F.D0.BB.D0.BE.D1.89.D0.B0.D0.B4.D1.8C_.D0.BF.D0.BE.D0.B4_.D0.BA.D1.80.D0.B8.D0.B2.D0.BE.D0.B9|AUC]] на выборке',
	'comment.data.train.auc':'[[ROC-кривая#.D0.9F.D0.BB.D0.BE.D1.89.D0.B0.D0.B4.D1.8C_.D0.BF.D0.BE.D0.B4_.D0.BA.D1.80.D0.B8.D0.B2.D0.BE.D0.B9|AUC]] на обучающей выборке',
	'comment.data.test.auc':'[[ROC-кривая#.D0.9F.D0.BB.D0.BE.D1.89.D0.B0.D0.B4.D1.8C_.D0.BF.D0.BE.D0.B4_.D0.BA.D1.80.D0.B8.D0.B2.D0.BE.D0.B9|AUC]] на тестовой выборке',
};
