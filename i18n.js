// ============================================================
// JOSKA - Internationalization (i18n) Module
// Supports: English (en), French (fr), Arabic (ar / RTL)
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
      'settings.uploadLogo':   'Upload Logo',
      'settings.saveBtn':      'Save Settings',
      'settings.saving':       'Saving...',
      'settings.saved':        'Settings saved successfully!',
      'settings.error':        'Failed to save settings. Please try again.',
      'settings.logoHint':     'Recommended: 200×200px, PNG or SVG',
      'settings.dragDrop':     'Drag & drop or click to upload',
      'settings.currency':     'Invoice Currency',
      'settings.currencyDesc': 'Choose the currency tag for invoices and reports — only the label changes, numeric values stay the same',
      'settings.currencyLabel':'Currency',
      'settings.excelLang':    'Excel Export Language',
      'settings.excelLangDesc':'Language used for the Monthly Breakdown Excel file (month names &amp; headers)',
      'settings.nav.companyInfo':  'Company Info',
      'settings.nav.branding':     'Branding',
      'settings.nav.invoiceColor': 'Invoice Color',
      'settings.nav.contact':      'Contact',
      'settings.section.companyInfo':    'Company Information',
      'settings.section.companyInfoDesc':'Basic details about your car rental agency',
      'settings.section.branding':       'Branding &amp; Visuals',
      'settings.section.brandingDesc':   'Logo and seal appear on your invoices and documents',
      'settings.section.contact':        'Contact Details',
      'settings.section.contactDesc':    'Shown on invoices and client communications',
      'settings.invoiceLang':     'Invoice Language',
      'settings.invoiceLangDesc': 'Language used for dates and numbers on the PDF invoice',

      // Invoices / PDF
      'inv.days':           'days',
      'inv.col.client':     'Client',
      'inv.col.vehicle':    'Vehicle',
      'inv.col.period':     'Period',
      'inv.col.status':     'Status',
      'inv.col.total':      'Total',
      'inv.filterAll':      'All',
      'inv.pageSubtitle':   'Create, manage, and export car rental invoices.',
      'inv.export':         'Export',
      'inv.noInvoices':     'No invoices yet',
      'inv.noInvoicesDesc': 'Create your first invoice using the button above.',
      'inv.newInvoice':     'New Invoice',
      'inv.newInvoiceDesc': 'Car rental agreement & invoice',
      'inv.saveDraft':      'Save Draft',
      'inv.downloadPDF':    'Download PDF',
      'inv.preview':        'Preview',
      'inv.previewEmpty':   'Fill in the form to preview',
      'inv.deleteTitle':    'Delete Invoice',
      'inv.deleteConfirm':  'Are you sure you want to permanently delete this invoice? This action cannot be undone.',
      'inv.pdfReady':       'PDF generated successfully!',
      'inv.deleted':        'Invoice deleted successfully.',
      'inv.isRequired':        'is required',
      'inv.dailyPriceRequired':'Please enter a daily price greater than 0.',
      'inv.dateRangeError':    'End date must be after start date.',
      'inv.section.customer': 'Customer',
      'inv.section.vehicle':  'Vehicle',
      'inv.section.period':   'Rental Period',
      'inv.section.pricing':  'Pricing',
      'inv.section.status':   'Status & Notes',

      'pdf.invoice':      'INVOICE',
      'pdf.issue':        'Issue Date',
      'pdf.due':          'Due Date',
      'pdf.billTo':       'Bill To',
      'pdf.cin':          'ID/Passport',
      'pdf.tel':          'Tel',
      'pdf.plate':        'Plate',
      'pdf.description':  'Description',
      'pdf.qty':          'Days',
      'pdf.unitPrice':    'Unit Price',
      'pdf.amount':       'Amount',
      'pdf.grandTotal':   'Grand Total',
      'pdf.status':       'Status',
      'pdf.notes':        'Notes',
      'pdf.ratePerDay':   'Rate Per Day',
      'pdf.generatedBy':  'Generated by JOSKA — Invoice & Revenue Management',
      'pdf.rentalPeriod': 'Rental Period',

      // Invoice field labels (form + PDF)
      'inv.field.dailyPrice':     'Daily Price',
      'inv.field.rentalSubtotal': 'Rental Subtotal',
      'inv.field.insurance':      'Insurance',
      'inv.field.fuel':           'Fuel',
      'inv.field.extraDriver':    'Extra Driver',
      'inv.field.other':          'Other Charges',
      'inv.field.total':          'Total',
      'inv.field.startDate':      'Start Date',
      'inv.field.endDate':        'End Date',
      'inv.field.clientName':     'Client Name',
      'inv.field.cin':            'ID/Passport',
      'inv.field.phone':          'Phone',
      'inv.field.vehicleBrand':   'Vehicle Brand',
      'inv.field.vehicleModel':   'Vehicle Model',
      'inv.field.plate':          'Plate',
      'inv.field.vehicle':        'Vehicle',
      'inv.field.status':         'Invoice Status',
      'inv.field.notes':          'Notes',

      // Clients
      'clients.subtitle':     'Manage your customers and their information',
      'clients.newClient':    'New Client',
      'clients.editClient':   'Edit Client',
      'clients.name':         'Name',
      'clients.cin':          'ID/Passport',
      'clients.phone':        'Phone',
      'clients.email':        'Email',
      'clients.invoices':     'Invoices',
      'clients.createInvoice':'Create Invoice',
      'clients.address':      'Address',
      'clients.notes':        'Notes',
      'clients.noClients':    'No clients yet',
      'clients.noClientsDesc':'Add your first client using the button above.',
      'clients.deleteTitle':  'Delete Client',
      'clients.deleteConfirm':'Are you sure you want to delete this client? This action cannot be undone.',
      'clients.saved':        'Client saved successfully!',
      'clients.updated':      'Client updated successfully!',
      'clients.deleted':      'Client deleted successfully.',

      // Reports
      'reports.title':           'Reports',
      'reports.subtitle':        'View revenue reports and trends for your rental business.',
      'reports.revenueTrend':    'Revenue Trend',
      'reports.monthlyBreakdown':'Monthly Breakdown',
      'reports.month':           'Month',
      'reports.revenue':         'Revenue',
      'reports.invoiceNumber':   'Invoice #',
      'reports.date':            'Date',

      // Template / Color settings
      'template.colorMode':   'Invoice Color',
      'template.colorDesc':   'Choose the accent color for your invoice PDFs.',
      'template.bw':          'Black & White',
      'template.custom':      'Custom Color',
      'template.chooseColor': 'Choose color',

      // Common
      'common.loading':  'Loading...',
      'common.saving':   'Saving...',
      'common.fillRequired': 'Please fill in all required fields.',
      'common.save':     'Save',
      'common.cancel':   'Cancel',
      'common.delete':   'Delete',
      'common.edit':     'Edit',
      'common.search':   'Search...',
      'common.currency': 'MAD',
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
      'settings.uploadLogo':   'Télécharger Logo',
      'settings.saveBtn':      'Enregistrer',
      'settings.saving':       'Enregistrement...',
      'settings.saved':        'Paramètres enregistrés avec succès !',
      'settings.error':        'Échec de l\'enregistrement. Réessayez.',
      'settings.logoHint':     'Recommandé : 200×200px, PNG ou SVG',
      'settings.dragDrop':     'Glisser-déposer ou cliquer pour télécharger',
      'settings.currency':     'Devise de Facture',
      'settings.currencyDesc': 'Choisissez l\'étiquette de devise — seul le libellé change, les valeurs restent identiques',
      'settings.currencyLabel':'Devise',
      'settings.excelLang':    'Langue d\'Export Excel',
      'settings.excelLangDesc':'Langue utilisée pour le fichier Excel du rapport mensuel (noms des mois &amp; en-têtes)',
      'settings.nav.companyInfo':  'Infos Entreprise',
      'settings.nav.branding':     'Image de Marque',
      'settings.nav.invoiceColor': 'Couleur Facture',
      'settings.nav.contact':      'Contact',
      'settings.section.companyInfo':    'Informations Entreprise',
      'settings.section.companyInfoDesc':'Informations de base sur votre agence de location',
      'settings.section.branding':       'Image de Marque &amp; Visuels',
      'settings.section.brandingDesc':   'Le logo et le cachet apparaissent sur vos factures et documents',
      'settings.section.contact':        'Coordonnées',
      'settings.section.contactDesc':    'Affichées sur les factures et communications clients',
      'settings.invoiceLang':     'Langue de la Facture',
      'settings.invoiceLangDesc': 'Langue utilisée pour les dates et nombres sur la facture PDF',

      // Invoices / PDF
      'inv.days':           'jours',
      'inv.col.client':     'Client',
      'inv.col.vehicle':    'Véhicule',
      'inv.col.period':     'Période',
      'inv.col.status':     'Statut',
      'inv.col.total':      'Total',
      'inv.filterAll':      'Tous',
      'inv.pageSubtitle':   'Créez, gérez et exportez des factures de location de voitures.',
      'inv.export':         'Exporter',
      'inv.noInvoices':     'Aucune facture',
      'inv.noInvoicesDesc': 'Créez votre première facture avec le bouton ci-dessus.',
      'inv.newInvoice':     'Nouvelle Facture',
      'inv.newInvoiceDesc': 'Contrat de location & facture',
      'inv.saveDraft':      'Sauvegarder le Brouillon',
      'inv.downloadPDF':    'Télécharger le PDF',
      'inv.preview':        'Aperçu',
      'inv.previewEmpty':   'Remplissez le formulaire pour voir l\'aperçu',
      'inv.deleteTitle':    'Supprimer la Facture',
      'inv.deleteConfirm':  'Êtes-vous sûr de vouloir supprimer définitivement cette facture ? Cette action est irréversible.',
      'inv.pdfReady':       'PDF généré avec succès !',
      'inv.deleted':        'Facture supprimée avec succès.',
      'inv.isRequired':        'est requis',
      'inv.dailyPriceRequired':'Veuillez entrer un prix journalier supérieur à 0.',
      'inv.dateRangeError':    'La date de fin doit être postérieure à la date de début.',
      'inv.section.customer': 'Client',
      'inv.section.vehicle':  'Véhicule',
      'inv.section.period':   'Période de Location',
      'inv.section.pricing':  'Tarification',
      'inv.section.status':   'Statut & Notes',

      'pdf.invoice':      'FACTURE',
      'pdf.issue':        'Date d\'émission',
      'pdf.due':          'Date d\'échéance',
      'pdf.billTo':       'Facturé à',
      'pdf.cin':          'ID/Passeport',
      'pdf.tel':          'Tél',
      'pdf.plate':        'Plaque',
      'pdf.description':  'Description',
      'pdf.qty':          'Jours',
      'pdf.unitPrice':    'Prix Unitaire',
      'pdf.amount':       'Montant',
      'pdf.grandTotal':   'Total Général',
      'pdf.status':       'Statut',
      'pdf.notes':        'Notes',
      'pdf.ratePerDay':   'Prix par Jour',
      'pdf.generatedBy':  'Généré par JOSKA — Gestion des Factures & Revenus',
      'pdf.rentalPeriod': 'Période de Location',

      'inv.field.dailyPrice':     'Prix Journalier',
      'inv.field.rentalSubtotal': 'Sous-total Location',
      'inv.field.insurance':      'Assurance',
      'inv.field.fuel':           'Carburant',
      'inv.field.extraDriver':    'Conducteur Suppl.',
      'inv.field.other':          'Autres Frais',
      'inv.field.total':          'Total',
      'inv.field.startDate':      'Date de Début',
      'inv.field.endDate':        'Date de Fin',
      'inv.field.clientName':     'Nom du Client',
      'inv.field.cin':            'ID/Passeport',
      'inv.field.phone':          'Téléphone',
      'inv.field.vehicleBrand':   'Marque',
      'inv.field.vehicleModel':   'Modèle',
      'inv.field.plate':          'Plaque',
      'inv.field.vehicle':        'Véhicule',
      'inv.field.status':         'Statut',
      'inv.field.notes':          'Notes',

      // Clients
      'clients.subtitle':     'Gérez vos clients et leurs informations',
      'clients.newClient':    'Nouveau Client',
      'clients.editClient':   'Modifier le Client',
      'clients.name':         'Nom',
      'clients.cin':          'ID/Passeport',
      'clients.phone':        'Téléphone',
      'clients.email':        'Email',
      'clients.invoices':     'Factures',
      'clients.createInvoice':'Créer une Facture',
      'clients.address':      'Adresse',
      'clients.notes':        'Notes',
      'clients.noClients':    'Aucun client',
      'clients.noClientsDesc':'Ajoutez votre premier client avec le bouton ci-dessus.',
      'clients.deleteTitle':  'Supprimer le Client',
      'clients.deleteConfirm':'Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.',
      'clients.saved':        'Client enregistré avec succès !',
      'clients.updated':      'Client mis à jour avec succès !',
      'clients.deleted':      'Client supprimé avec succès.',

      // Reports
      'reports.title':           'Rapports',
      'reports.subtitle':        'Consultez les rapports de revenus et les tendances de votre activité de location.',
      'reports.revenueTrend':    'Tendance des Revenus',
      'reports.monthlyBreakdown':'Répartition Mensuelle',
      'reports.month':           'Mois',
      'reports.revenue':         'Revenu',
      'reports.invoiceNumber':   'N° Facture',
      'reports.date':            'Date',

      // Template / Color settings
      'template.colorMode':   'Couleur de la Facture',
      'template.colorDesc':   'Choisissez la couleur d\'accentuation pour vos factures PDF.',
      'template.bw':          'Noir & Blanc',
      'template.custom':      'Couleur Personnalisée',
      'template.chooseColor': 'Choisir la couleur',

      'common.loading':  'Chargement...',
      'common.saving':   'Enregistrement...',
      'common.fillRequired': 'Veuillez remplir tous les champs obligatoires.',
      'common.save':     'Enregistrer',
      'common.cancel':   'Annuler',
      'common.delete':   'Supprimer',
      'common.edit':     'Modifier',
      'common.search':   'Rechercher...',
      'common.currency': 'MAD',
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
      'settings.uploadLogo':   'رفع الشعار',
      'settings.saveBtn':      'حفظ الإعدادات',
      'settings.saving':       'جارٍ الحفظ...',
      'settings.saved':        'تم حفظ الإعدادات بنجاح!',
      'settings.error':        'فشل الحفظ. يرجى المحاولة مرة أخرى.',
      'settings.logoHint':     'موصى به: 200×200 بكسل، PNG أو SVG',
      'settings.dragDrop':     'اسحب وأفلت أو انقر للرفع',
      'settings.currency':     'عملة الفاتورة',
      'settings.currencyDesc': 'اختر تسمية العملة — يتغير التصنيف فقط، وتبقى القيم كما هي',
      'settings.currencyLabel':'العملة',
      'settings.excelLang':    'لغة تصدير Excel',
      'settings.excelLangDesc':'اللغة المستخدمة في ملف Excel للتقرير الشهري (أسماء الأشهر &amp; الرؤوس)',
      'settings.nav.companyInfo':  'معلومات الشركة',
      'settings.nav.branding':     'العلامة التجارية',
      'settings.nav.invoiceColor': 'لون الفاتورة',
      'settings.nav.contact':      'الاتصال',
      'settings.section.companyInfo':    'معلومات الشركة',
      'settings.section.companyInfoDesc':'التفاصيل الأساسية لوكالة تأجير السيارات الخاصة بك',
      'settings.section.branding':       'العلامة التجارية &amp; المرئيات',
      'settings.section.brandingDesc':   'يظهر الشعار والختم على فواتيرك ومستنداتك',
      'settings.section.contact':        'تفاصيل الاتصال',
      'settings.section.contactDesc':    'تظهر على الفواتير واتصالات العملاء',
      'settings.invoiceLang':     'لغة الفاتورة',
      'settings.invoiceLangDesc': 'اللغة المستخدمة للتواريخ والأرقام في فاتورة PDF',

      // Invoices / PDF
      'inv.days':           'أيام',
      'inv.col.client':     'العميل',
      'inv.col.vehicle':    'المركبة',
      'inv.col.period':     'الفترة',
      'inv.col.status':     'الحالة',
      'inv.col.total':      'المجموع',
      'inv.filterAll':      'الكل',
      'inv.pageSubtitle':   'إنشاء وإدارة وتصدير فواتير تأجير السيارات.',
      'inv.export':         'تصدير',
      'inv.noInvoices':     'لا توجد فواتير بعد',
      'inv.noInvoicesDesc': 'أنشئ فاتورتك الأولى باستخدام الزر أعلاه.',
      'inv.newInvoice':     'فاتورة جديدة',
      'inv.newInvoiceDesc': 'اتفاقية تأجير سيارات وفاتورة',
      'inv.saveDraft':      'حفظ كمسودة',
      'inv.downloadPDF':    'تحميل PDF',
      'inv.preview':        'معاينة',
      'inv.previewEmpty':   'املأ النموذج للمعاينة',
      'inv.deleteTitle':    'حذف الفاتورة',
      'inv.deleteConfirm':  'هل أنت متأكد من حذف هذه الفاتورة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      'inv.pdfReady':       'تم إنشاء PDF بنجاح!',
      'inv.deleted':        'تم حذف الفاتورة بنجاح.',
      'inv.isRequired':        'مطلوب',
      'inv.dailyPriceRequired':'يرجى إدخال سعر يومي أكبر من 0.',
      'inv.dateRangeError':    'يجب أن يكون تاريخ النهاية بعد تاريخ البداية.',
      'inv.section.customer': 'العميل',
      'inv.section.vehicle':  'المركبة',
      'inv.section.period':   'فترة الإيجار',
      'inv.section.pricing':  'التسعير',
      'inv.section.status':   'الحالة والملاحظات',

      'pdf.invoice':      'فاتورة',
      'pdf.issue':        'تاريخ الإصدار',
      'pdf.due':          'تاريخ الاستحقاق',
      'pdf.billTo':       'المفوتر إليه',
      'pdf.cin':          'رقم الهوية',
      'pdf.tel':          'هاتف',
      'pdf.plate':        'لوحة',
      'pdf.description':  'الوصف',
      'pdf.qty':          'أيام',
      'pdf.unitPrice':    'سعر الوحدة',
      'pdf.amount':       'المبلغ',
      'pdf.grandTotal':   'المجموع الإجمالي',
      'pdf.status':       'الحالة',
      'pdf.notes':        'ملاحظات',
      'pdf.ratePerDay':   'السعر اليومي',
      'pdf.generatedBy':  'تم الإنشاء بواسطة جوسكا — إدارة الفواتير والإيرادات',
      'pdf.rentalPeriod': 'فترة الإيجار',

      'inv.field.dailyPrice':     'السعر اليومي',
      'inv.field.rentalSubtotal': 'المجموع الفرعي للتأجير',
      'inv.field.insurance':      'التأمين',
      'inv.field.fuel':           'الوقود',
      'inv.field.extraDriver':    'سائق إضافي',
      'inv.field.other':          'رسوم أخرى',
      'inv.field.total':          'المجموع',
      'inv.field.startDate':      'تاريخ البداية',
      'inv.field.endDate':        'تاريخ النهاية',
      'inv.field.clientName':     'اسم العميل',
      'inv.field.cin':            'رقم الهوية',
      'inv.field.phone':          'الهاتف',
      'inv.field.vehicleBrand':   'ماركة المركبة',
      'inv.field.vehicleModel':   'موديل المركبة',
      'inv.field.plate':          'اللوحة',
      'inv.field.vehicle':        'المركبة',
      'inv.field.status':         'حالة الفاتورة',
      'inv.field.notes':          'ملاحظات',

      // Clients
      'clients.subtitle':     'إدارة عملائك ومعلوماتهم',
      'clients.newClient':    'عميل جديد',
      'clients.editClient':   'تعديل العميل',
      'clients.name':         'الاسم',
      'clients.cin':          'رقم الهوية / جواز السفر',
      'clients.phone':        'الهاتف',
      'clients.email':        'البريد الإلكتروني',
      'clients.invoices':     'الفواتير',
      'clients.createInvoice':'إنشاء فاتورة',
      'clients.address':      'العنوان',
      'clients.notes':        'ملاحظات',
      'clients.noClients':    'لا يوجد عملاء بعد',
      'clients.noClientsDesc':'أضف عميلك الأول باستخدام الزر أعلاه.',
      'clients.deleteTitle':  'حذف العميل',
      'clients.deleteConfirm':'هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.',
      'clients.saved':        'تم حفظ العميل بنجاح!',
      'clients.updated':      'تم تحديث العميل بنجاح!',
      'clients.deleted':      'تم حذف العميل بنجاح.',

      // Reports
      'reports.title':           'التقارير',
      'reports.subtitle':        'عرض تقارير الإيرادات والاتجاهات لنشاط التأجير الخاص بك.',
      'reports.revenueTrend':    'اتجاه الإيرادات',
      'reports.monthlyBreakdown':'التفصيل الشهري',
      'reports.month':           'الشهر',
      'reports.revenue':         'الإيرادات',
      'reports.invoiceNumber':   'رقم الفاتورة',
      'reports.date':            'التاريخ',

      // Template / Color settings
      'template.colorMode':   'لون الفاتورة',
      'template.colorDesc':   'اختر لون التمييز لفواتير PDF الخاصة بك.',
      'template.bw':          'أبيض وأسود',
      'template.custom':      'لون مخصص',
      'template.chooseColor': 'اختيار لون',

      'common.loading':  'جارٍ التحميل...',
      'common.saving':   'جارٍ الحفظ...',
      'common.fillRequired': 'يرجى ملء جميع الحقول المطلوبة.',
      'common.save':     'حفظ',
      'common.cancel':   'إلغاء',
      'common.delete':   'حذف',
      'common.edit':     'تعديل',
      'common.search':   'بحث...',
      'common.currency': 'درهم',
    }
  };

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key])
      || (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key])
      || key;
  }

  function tLang(key, lang) {
    return (translations[lang] && translations[lang][key])
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

  function setCurrency(code) {
    ['en', 'fr', 'ar'].forEach(lang => {
      if (translations[lang]) translations[lang]['common.currency'] = code;
    });
    applyToDOM();
  }

  function isRTL() { return RTL_LANGS.includes(currentLang); }

  function applyDirection() {
    const dir = isRTL() ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLang);
    document.body.classList.toggle('rtl', isRTL());
  }

  function applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
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

    // Wire language switcher buttons
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });

    // Update active state on lang change
    document.addEventListener('joska:langChanged', ({ detail }) => {
      document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === detail.lang);
      });
    });
  }

  return { t, tLang, setLang, getLang, setCurrency, isRTL, init, applyToDOM };
})();
