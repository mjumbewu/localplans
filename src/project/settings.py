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
    'proxy',
)

###############################################################################
#
# For the sake of Heroku, do this if there is a DATABASE_URL in the
# environment variables.
#
# This is added here so that we can use our own directory structure on Heroku.
# Remember to manually add the shared-database:5mb addon.
#

import os
import sys
import urlparse

# Register database schemes in URLs.
urlparse.uses_netloc.append('postgres')
urlparse.uses_netloc.append('mysql')

try:

    # Check to make sure DATABASES is set in settings.py file.
    # If not default to {}

    if 'DATABASES' not in locals():
        DATABASES = {}

    if 'DATABASE_URL' in os.environ:
        url = urlparse.urlparse(os.environ['DATABASE_URL'])

        # Ensure default database exists.
        DATABASES['default'] = DATABASES.get('default', {})

        # Update with environment configuration.
        DATABASES['default'].update({
            'NAME': url.path[1:],
            'USER': url.username,
            'PASSWORD': url.password,
            'HOST': url.hostname,
            'PORT': url.port,
        })
        if url.scheme == 'postgres':
            DATABASES['default']['ENGINE'] = 'django.db.backends.postgresql_psycopg2'

        if url.scheme == 'mysql':
            DATABASES['default']['ENGINE'] = 'django.db.backends.mysql'
except Exception:
    print 'Unexpected error:', sys.exc_info()
