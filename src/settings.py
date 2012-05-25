import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
    }
}

# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
TIME_ZONE = 'America/Chicago'
USE_TZ = True

# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True

MEDIA_ROOT = ''
MEDIA_URL = ''

STATIC_ROOT = ''
STATIC_URL = '/static/'
STATICFILES_DIRS = os.path.join(os.path.dirname(__file__), '..', 'static'),

SECRET_KEY = '+96u9u668ngc%g@+zsndux82(zo3juk$e3tw_w0u$0ol%k$hm!'

TEMPLATE_DIRS = os.path.join(os.path.dirname(__file__), '..', 'templates'),
MUSTACHEJS_DIRS = os.path.join(os.path.dirname(__file__), '..', 'jstemplates'),

ROOT_URLCONF = 'project.urls'

WSGI_APPLICATION = 'project.wsgi.application'

INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'mustachejs',

    'project',
)
