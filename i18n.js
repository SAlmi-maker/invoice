// ============================================================
// JOSKA - Internationalization (i18n) Module
// Supports: English (en), French (fr), Arabic (ar / RTL)
// Updated: Invoice module keys added
// ============================================================

const JOSKA_I18N = (() => {
  const STORAGE_KEY = 'joska_lang';
  const DEFAULT_LANG = 'en';
  const RTL_LANGS    = ['ar'];

  const translations = {
    en: {
      // Brand
      'brand.name': 'JOSKA',
      'brand.tagline': 'Invoice & Revenue Management',

      // Auth
      'auth.loginTitle':      'Welcome Back',
      'auth.loginSubtitle':   'Sign in to your JOSKA account',
      'auth.email':           'Email Address',
      'auth.password':        'Password',
      'auth.loginBtn':        'Sign In',
      'auth.forgotPassword':  'Forgot password?',
      'auth.backToLogin':     'Back to Sign In',
      'auth.resetTitle':      'Reset Password',
      'auth.resetSubtitle':   'Enter your email and we\'ll send a reset link',
      'auth.resetEmail':      'Email Address',
      'auth.resetBtn':        'Send Reset Link',
      'auth.resetSent':       'Password reset email sent! Check your inbox.',
      'auth.userNotFound':    'No account found with this email.',
      'auth.wrongPassword':   'Incorrect password. Please try again.',
      'auth.invalidEmail':    'Please enter a valid email address.',
      'auth.tooManyRequests': 'Too many attempts. Please try again later.',
      'auth.userDisabled':    'This account has been disabled.',
      'auth.genericError':    'Authentication failed. Please try again.',

      // Navigation
      'nav.dashboard':  'Dashboard',
      'nav.invoices':   'Invoices',
      'nav.clients':    'Clients',
      'nav.reports':    'Reports',
      'nav.settings':   'Settings',
      'nav.logout':     'Sign Out',

      // Dashboard
      'dash.welcome':         'Welcome back',
      'dash.overviewTitle':   'Revenue Overview',
      'dash.revenueToday':    'Revenue Today',
      'dash.revenueMonth':    'This Month',
      'dash.revenueYear':     'This Year',
      'dash.totalInvoices':   'Total Invoices',
      'dash.recentInvoices':  'Recent Invoices',
      'dash.quickActions':    'Quick Actions',
      'dash.newInvoice':      'New Invoice',
      'dash.viewAll':         'View All',
      'dash.noData':          'No data available yet.',
      'dash.companySetup':    'Complete your company setup',
      'dash.companySetupDesc':'Add your company details to get started.',
      'dash.goToSettings':    'Go to Settings',
      'dash.paid':            'Paid',
      'dash.pending':         'Pending',
      'dash.overdue':         'Overdue',
      'dash.draft':           'Draft',
      'dash.vsLastMonth':     'vs last month',
      'dash.vsLastYear':      'vs last year',
      'dash.invoicesThisMonth': 'This month',

      // Settings
      'settings.title':        'Company Settings',
      'settings.subtitle':     'Manage your company profile and branding',
      'settings.companyName':  'Company Name',
      'settings.address':      'Address',
      'settings.phone':        'Phone Number',
      'settings.email':        'Email Address',
      'settings.website':      'Website',
      'settings.logo':         'Company Logo',
      'settings.seal':         'Company Seal / Stamp',
      'settings.uploadLogo':   'Upload Logo',
      'settings.uploadSeal':   'Upload Seal',
      'settings.saveBtn':      'Save Settings',
      'settings.saving':       'Saving...',
      'settings.saved':        'Settings saved successfully!',
      'settings.error':        'Failed to save settings. Please try again.',
      'settings.logoHint':     'Recommended: 200×200px, PNG or SVG',
      'settings.sealHint':     'Recommended: 200×200px, PNG with transparency',
      'settings.dragDrop':     'Drag & drop or click to upload',

      // Common
      'common.loading':  'Loading...',
      'common.save':     'Save',
      'common.cancel':   'Cancel',
      'common.delete':   'Delete',
      'common.edit':     'Edit',
      'common.search':   'Search...',
      'common.currency': 'MAD',

      // Invoices
      'inv.pageSubtitle':        'Create, manage, and export car rental invoices.',
      'inv.newInvoice':          'New Invoice',
      'inv.newInvoiceDesc':      'Car rental agreement & invoice',
      'inv.saveDraft':           'Save Draft',
      'inv.downloadPDF':         'Download PDF',
      'inv.pdfReady':            'PDF downloaded successfully!',
      'inv.export':              'Export',
      'inv.filterAll':           'All',
      'inv.noInvoices':          'No invoices yet',
      'inv.noInvoicesDesc':      'Create your first invoice using the button above.',
      'inv.deleted':             'Invoice deleted.',
      'inv.deleteTitle':         'Delete Invoice',
      'inv.deleteConfirm':       'Are you sure you want to permanently delete this invoice? This action cannot be undone.',
      'inv.days':                'days',
      'inv.isRequired':          'is required.',
      'inv.dailyPriceRequired':  'Daily price must be greater than 0.',
      'inv.dateRangeError':      'End date cannot be before start date.',
      'inv.section.customer':    'Customer',
      'inv.section.vehicle':     'Vehicle',
      'inv.section.period':      'Rental Period',
      'inv.section.pricing':     'Pricing',
      'inv.section.status':      'Status & Notes',
      'inv.field.clientName':    'Customer Name',
      'inv.field.cin':           'CIN / Passport',
      'inv.field.phone':         'Phone',
      'inv.field.vehicleBrand':  'Brand',
      'inv.field.vehicleModel':  'Model',
      'inv.field.plate':         'Registration Plate',
      'inv.field.startDate':     'Start Date',
      'inv.field.endDate':       'End Date',
      'inv.field.dailyPrice':    'Daily Price',
      'inv.field.rentalSubtotal':'Rental Subtotal',
      'inv.field.insurance':     'Insurance',
      'inv.field.fuel':          'Fuel',
      'inv.field.extraDriver':   'Extra Driver',
      'inv.field.other':         'Other Charges',
      'inv.field.total':         'Total',
      'inv.field.status':        'Invoice Status',
      'inv.field.notes':         'Notes',
      'inv.col.client':          'Client',
      'inv.col.vehicle':         'Vehicle',
      'inv.col.period':          'Period',
      'inv.col.total':           'Total',
      'inv.col.status':          'Status',
    },

    fr: {
      'brand.name': 'JOSKA',
      'brand.tagline': 'Gestion des Factures & Revenus',

      'auth.loginTitle':      'Bon Retour',
      'auth.loginSubtitle':   'Connectez-vous à votre compte JOSKA',
      'auth.email':           'Adresse E-mail',
      'auth.password':        'Mot de Passe',
      'auth.loginBtn':        'Se Connecter',
      'auth.forgotPassword':  'Mot de passe oublié ?',
      'auth.backToLogin':     'Retour à la connexion',
      'auth.resetTitle':      'Réinitialiser le Mot de Passe',
      'auth.resetSubtitle':   'Entrez votre e-mail et nous vous enverrons un lien',
      'auth.resetEmail':      'Adresse E-mail',
      'auth.resetBtn':        'Envoyer le Lien',
      'auth.resetSent':       'E-mail de réinitialisation envoyé ! Vérifiez votre boîte.',
      'auth.userNotFound':    'Aucun compte trouvé avec cet e-mail.',
      'auth.wrongPassword':   'Mot de passe incorrect. Veuillez réessayer.',
      'auth.invalidEmail':    'Veuillez saisir une adresse e-mail valide.',
      'auth.tooManyRequests': 'Trop de tentatives. Réessayez plus tard.',
      'auth.userDisabled':    'Ce compte a été désactivé.',
      'auth.genericError':    'Échec de l\'authentification. Veuillez réessayer.',

      'nav.dashboard':  'Tableau de Bord',
      'nav.invoices':   'Factures',
      'nav.clients':    'Clients',
      'nav.reports':    'Rapports',
      'nav.settings':   'Paramètres',
      'nav.logout':     'Déconnexion',

      'dash.welcome':         'Bon retour',
      'dash.overviewTitle':   'Aperçu des Revenus',
      'dash.revenueToday':    'Revenus Aujourd\'hui',
      'dash.revenueMonth':    'Ce Mois',
      'dash.revenueYear':     'Cette Année',
      'dash.totalInvoices':   'Total Factures',
      'dash.recentInvoices':  'Factures Récentes',
      'dash.quickActions':    'Actions Rapides',
      'dash.newInvoice':      'Nouvelle Facture',
      'dash.viewAll':         'Voir Tout',
      'dash.noData':          'Aucune donnée disponible.',
      'dash.companySetup':    'Complétez votre profil entreprise',
      'dash.companySetupDesc':'Ajoutez vos informations pour commencer.',
      'dash.goToSettings':    'Aller aux Paramètres',
      'dash.paid':            'Payé',
      'dash.pending':         'En attente',
      'dash.overdue':         'En retard',
      'dash.draft':           'Brouillon',
      'dash.vsLastMonth':     'vs mois dernier',
      'dash.vsLastYear':      'vs année dernière',
      'dash.invoicesThisMonth': 'Ce mois',

      'settings.title':        'Paramètres Entreprise',
      'settings.subtitle':     'Gérez le profil et l\'image de votre entreprise',
      'settings.companyName':  'Nom de l\'Entreprise',
      'settings.address':      'Adresse',
      'settings.phone':        'Numéro de Téléphone',
      'settings.email':        'Adresse E-mail',
      'settings.website':      'Site Web',
      'settings.logo':         'Logo de l\'Entreprise',
      'settings.seal':         'Cachet / Tampon',
      'settings.uploadLogo':   'Télécharger Logo',
      'settings.uploadSeal':   'Télécharger Cachet',
      'settings.saveBtn':      'Enregistrer',
      'settings.saving':       'Enregistrement...',
      'settings.saved':        'Paramètres enregistrés avec succès !',
      'settings.error':        'Échec de l\'enregistrement. Réessayez.',
      'settings.logoHint':     'Recommandé : 200×200px, PNG ou SVG',
      'settings.sealHint':     'Recommandé : 200×200px, PNG transparent',
      'settings.dragDrop':     'Glisser-déposer ou cliquer pour télécharger',

      'common.loading':  'Chargement...',
      'common.save':     'Enregistrer',
      'common.cancel':   'Annuler',
      'common.delete':   'Supprimer',
      'common.edit':     'Modifier',
      'common.search':   'Rechercher...',
      'common.currency': 'MAD',

      'inv.pageSubtitle':        'Créez, gérez et exportez vos factures de location.',
      'inv.newInvoice':          'Nouvelle Facture',
      'inv.newInvoiceDesc':      'Contrat de location et facture',
      'inv.saveDraft':           'Enregistrer Brouillon',
      'inv.downloadPDF':         'Télécharger PDF',
      'inv.pdfReady':            'PDF téléchargé avec succès !',
      'inv.export':              'Exporter',
      'inv.filterAll':           'Tout',
      'inv.noInvoices':          'Aucune facture',
      'inv.noInvoicesDesc':      'Créez votre première facture avec le bouton ci-dessus.',
      'inv.deleted':             'Facture supprimée.',
      'inv.deleteTitle':         'Supprimer la Facture',
      'inv.deleteConfirm':       'Voulez-vous vraiment supprimer définitivement cette facture ? Cette action est irréversible.',
      'inv.days':                'jours',
      'inv.isRequired':          'est requis.',
      'inv.dailyPriceRequired':  'Le prix journalier doit être supérieur à 0.',
      'inv.dateRangeError':      'La date de fin ne peut pas être antérieure à la date de début.',
      'inv.section.customer':    'Client',
      'inv.section.vehicle':     'Véhicule',
      'inv.section.period':      'Période de Location',
      'inv.section.pricing':     'Tarification',
      'inv.section.status':      'Statut & Notes',
      'inv.field.clientName':    'Nom du Client',
      'inv.field.cin':           'CIN / Passeport',
      'inv.field.phone':         'Téléphone',
      'inv.field.vehicleBrand':  'Marque',
      'inv.field.vehicleModel':  'Modèle',
      'inv.field.plate':         'Immatriculation',
      'inv.field.startDate':     'Date de Début',
      'inv.field.endDate':       'Date de Fin',
      'inv.field.dailyPrice':    'Prix Journalier',
      'inv.field.rentalSubtotal':'Sous-total Location',
      'inv.field.insurance':     'Assurance',
      'inv.field.fuel':          'Carburant',
      'inv.field.extraDriver':   'Conducteur Supplémentaire',
      'inv.field.other':         'Autres Frais',
      'inv.field.total':         'Total',
      'inv.field.status':        'Statut de la Facture',
      'inv.field.notes':         'Notes',
      'inv.col.client':          'Client',
      'inv.col.vehicle':         'Véhicule',
      'inv.col.period':          'Période',
      'inv.col.total':           'Total',
      'inv.col.status':          'Statut',
    },

    ar: {
      'brand.name': 'جوسكا',
      'brand.tagline': 'إدارة الفواتير والإيرادات',

      'auth.loginTitle':      'مرحباً بعودتك',
      'auth.loginSubtitle':   'سجّل الدخول إلى حساب جوسكا',
      'auth.email':           'البريد الإلكتروني',
      'auth.password':        'كلمة المرور',
      'auth.loginBtn':        'تسجيل الدخول',
      'auth.forgotPassword':  'نسيت كلمة المرور؟',
      'auth.backToLogin':     'العودة إلى تسجيل الدخول',
      'auth.resetTitle':      'إعادة تعيين كلمة المرور',
      'auth.resetSubtitle':   'أدخل بريدك وسنرسل لك رابط إعادة التعيين',
      'auth.resetEmail':      'البريد الإلكتروني',
      'auth.resetBtn':        'إرسال الرابط',
      'auth.resetSent':       'تم إرسال بريد إعادة التعيين! تحقق من صندوقك.',
      'auth.userNotFound':    'لا يوجد حساب بهذا البريد الإلكتروني.',
      'auth.wrongPassword':   'كلمة المرور غير صحيحة. حاول مرة أخرى.',
      'auth.invalidEmail':    'يرجى إدخال بريد إلكتروني صالح.',
      'auth.tooManyRequests': 'محاولات كثيرة جداً. حاول لاحقاً.',
      'auth.userDisabled':    'تم تعطيل هذا الحساب.',
      'auth.genericError':    'فشل المصادقة. يرجى المحاولة مرة أخرى.',

      'nav.dashboard':  'لوحة التحكم',
      'nav.invoices':   'الفواتير',
      'nav.clients':    'العملاء',
      'nav.reports':    'التقارير',
      'nav.settings':   'الإعدادات',
      'nav.logout':     'تسجيل الخروج',

      'dash.welcome':         'مرحباً',
      'dash.overviewTitle':   'نظرة عامة على الإيرادات',
      'dash.revenueToday':    'إيرادات اليوم',
      'dash.revenueMonth':    'هذا الشهر',
      'dash.revenueYear':     'هذا العام',
      'dash.totalInvoices':   'إجمالي الفواتير',
      'dash.recentInvoices':  'الفواتير الأخيرة',
      'dash.quickActions':    'إجراءات سريعة',
      'dash.newInvoice':      'فاتورة جديدة',
      'dash.viewAll':         'عرض الكل',
      'dash.noData':          'لا توجد بيانات متاحة.',
      'dash.companySetup':    'أكمل إعداد شركتك',
      'dash.companySetupDesc':'أضف تفاصيل شركتك للبدء.',
      'dash.goToSettings':    'الذهاب إلى الإعدادات',
      'dash.paid':            'مدفوع',
      'dash.pending':         'معلق',
      'dash.overdue':         'متأخر',
      'dash.draft':           'مسودة',
      'dash.vsLastMonth':     'مقارنة بالشهر الماضي',
      'dash.vsLastYear':      'مقارنة بالعام الماضي',
      'dash.invoicesThisMonth': 'هذا الشهر',

      'settings.title':        'إعدادات الشركة',
      'settings.subtitle':     'إدارة ملف الشركة والعلامة التجارية',
      'settings.companyName':  'اسم الشركة',
      'settings.address':      'العنوان',
      'settings.phone':        'رقم الهاتف',
      'settings.email':        'البريد الإلكتروني',
      'settings.website':      'الموقع الإلكتروني',
      'settings.logo':         'شعار الشركة',
      'settings.seal':         'ختم / طابع الشركة',
      'settings.uploadLogo':   'رفع الشعار',
      'settings.uploadSeal':   'رفع الختم',
      'settings.saveBtn':      'حفظ الإعدادات',
      'settings.saving':       'جارٍ الحفظ...',
      'settings.saved':        'تم حفظ الإعدادات بنجاح!',
      'settings.error':        'فشل الحفظ. يرجى المحاولة مرة أخرى.',
      'settings.logoHint':     'موصى به: 200×200 بكسل، PNG أو SVG',
      'settings.sealHint':     'موصى به: 200×200 بكسل، PNG بخلفية شفافة',
      'settings.dragDrop':     'اسحب وأفلت أو انقر للرفع',

      'common.loading':  'جارٍ التحميل...',
      'common.save':     'حفظ',
      'common.cancel':   'إلغاء',
      'common.delete':   'حذف',
      'common.edit':     'تعديل',
      'common.search':   'بحث...',
      'common.currency': 'درهم',

      'inv.pageSubtitle':        'أنشئ وأدر وصدّر فواتير تأجير السيارات.',
      'inv.newInvoice':          'فاتورة جديدة',
      'inv.newInvoiceDesc':      'عقد إيجار وفاتورة',
      'inv.saveDraft':           'حفظ كمسودة',
      'inv.downloadPDF':         'تنزيل PDF',
      'inv.pdfReady':            'تم تنزيل PDF بنجاح!',
      'inv.export':              'تصدير',
      'inv.filterAll':           'الكل',
      'inv.noInvoices':          'لا توجد فواتير بعد',
      'inv.noInvoicesDesc':      'أنشئ فاتورتك الأولى باستخدام الزر أعلاه.',
      'inv.deleted':             'تم حذف الفاتورة.',
      'inv.deleteTitle':         'حذف الفاتورة',
      'inv.deleteConfirm':       'هل أنت متأكد من حذف هذه الفاتورة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      'inv.days':                'أيام',
      'inv.isRequired':          'مطلوب.',
      'inv.dailyPriceRequired':  'يجب أن يكون السعر اليومي أكبر من 0.',
      'inv.dateRangeError':      'لا يمكن أن تكون تاريخ الانتهاء قبل تاريخ البدء.',
      'inv.section.customer':    'العميل',
      'inv.section.vehicle':     'المركبة',
      'inv.section.period':      'فترة الإيجار',
      'inv.section.pricing':     'التسعير',
      'inv.section.status':      'الحالة والملاحظات',
      'inv.field.clientName':    'اسم العميل',
      'inv.field.cin':           'رقم الهوية / الجواز',
      'inv.field.phone':         'الهاتف',
      'inv.field.vehicleBrand':  'الماركة',
      'inv.field.vehicleModel':  'الموديل',
      'inv.field.plate':         'لوحة التسجيل',
      'inv.field.startDate':     'تاريخ البدء',
      'inv.field.endDate':       'تاريخ الانتهاء',
      'inv.field.dailyPrice':    'السعر اليومي',
      'inv.field.rentalSubtotal':'المجموع الفرعي للإيجار',
      'inv.field.insurance':     'التأمين',
      'inv.field.fuel':          'الوقود',
      'inv.field.extraDriver':   'سائق إضافي',
      'inv.field.other':         'رسوم أخرى',
      'inv.field.total':         'الإجمالي',
      'inv.field.status':        'حالة الفاتورة',
      'inv.field.notes':         'ملاحظات',
      'inv.col.client':          'العميل',
      'inv.col.vehicle':         'المركبة',
      'inv.col.period':          'الفترة',
      'inv.col.total':           'الإجمالي',
      'inv.col.status':          'الحالة',
    }
  };

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key])
      || (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key])
      || key;
  }

  function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyToDOM();
    applyDirection();
    document.dispatchEvent(new CustomEvent('joska:langChanged', { detail: { lang } }));
  }

  function getLang() { return currentLang; }

  function isRTL() { return RTL_LANGS.includes(currentLang); }

  function applyDirection() {
    const dir = isRTL() ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLang);
    document.body.classList.toggle('rtl', isRTL());
  }

  function applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key  = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, t(key));
      } else {
        el.textContent = t(key);
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
  }

  function init() {
    applyDirection();
    applyToDOM();

    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });

    document.addEventListener('joska:langChanged', ({ detail }) => {
      document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === detail.lang);
      });
    });
  }

  return { t, setLang, getLang, isRTL, init, applyToDOM };
})();
