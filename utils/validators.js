const { body, validationResult } = require('express-validator');

// Middleware para tratar erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validações reutilizáveis
const validations = {
  produto: {
    create: [
      body('nome')
        .trim()
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
      body('descricao')
        .trim()
        .notEmpty().withMessage('Descrição é obrigatória')
        .isLength({ min: 5, max: 500 }).withMessage('Descrição deve ter entre 5 e 500 caracteres'),
      body('valor')
        .trim()
        .notEmpty().withMessage('Valor é obrigatório')
        .isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
      body('vendedor')
        .trim()
        .notEmpty().withMessage('Vendedor é obrigatório')
        .isLength({ min: 2, max: 100 }).withMessage('Vendedor deve ter entre 2 e 100 caracteres'),
      body('estoque')
        .trim()
        .notEmpty().withMessage('Estoque é obrigatório')
        .isFloat({ min: 0 }).withMessage('Estoque deve ser um número positivo'),
      body('data')
        .trim()
        .notEmpty().withMessage('Data é obrigatória')
        .isISO8601().withMessage('Data deve ser válida')
    ],
    update: [
      body('nome')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
      body('descricao')
        .optional()
        .trim()
        .isLength({ min: 5, max: 500 }).withMessage('Descrição deve ter entre 5 e 500 caracteres'),
      body('valor')
        .optional()
        .trim()
        .isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
      body('vendedor')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Vendedor deve ter entre 2 e 100 caracteres'),
      body('estoque')
        .optional()
        .trim()
        .isFloat({ min: 0 }).withMessage('Estoque deve ser um número positivo'),
      body('data')
        .optional()
        .trim()
        .isISO8601().withMessage('Data deve ser válida')
    ]
  },
  servico: {
    create: [
      body('nome')
        .trim()
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
      body('descricao')
        .trim()
        .notEmpty().withMessage('Descrição é obrigatória')
        .isLength({ min: 5, max: 500 }).withMessage('Descrição deve ter entre 5 e 500 caracteres'),
      body('valor')
        .trim()
        .notEmpty().withMessage('Valor é obrigatório')
        .isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
      body('imagem')
        .trim()
        .notEmpty().withMessage('Imagem é obrigatória'),
      body('produto')
        .isArray().withMessage('Produto deve ser um array')
    ]
  },
  agenda: {
    create: [
      body('nome')
        .trim()
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
      body('data')
        .trim()
        .notEmpty().withMessage('Data é obrigatória')
        .isISO8601().withMessage('Data deve ser válida'),
      body('hora')
        .trim()
        .notEmpty().withMessage('Hora é obrigatória')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Hora deve estar no formato HH:mm'),
      body('procedimento')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Procedimento não pode exceder 200 caracteres'),
      body('preco')
        .optional()
        .trim()
        .isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo')
    ]
  }
};

module.exports = {
  handleValidationErrors,
  validations
};
