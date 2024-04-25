package com.android.sharetest

import android.content.ContentProvider
import android.content.ContentValues
import android.content.Intent
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import android.os.Bundle
import android.os.CancellationSignal
import android.os.SystemClock
import android.service.chooser.AdditionalContentContract
import kotlin.random.Random

class AdditionalContentProvider : ContentProvider() {
    override fun onCreate(): Boolean {
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<String>?,
        queryArgs: Bundle?,
        cancellationSignal: CancellationSignal?,
    ): Cursor? {
        val context = context ?: return null
        val cursor = MatrixCursor(arrayOf(AdditionalContentContract.Columns.URI))
        val chooserIntent =
            queryArgs?.getParcelable(Intent.EXTRA_INTENT, Intent::class.java) ?: return cursor
        // Images are img1 ... img8
        val uris = Array(ImageContentProvider.IMAGE_COUNT) { idx ->
            ImageContentProvider.makeItemUri(idx + 1, "image/jpeg")
        }
        val callingPackage = getCallingPackage()
        for (u in uris) {
            cursor.addRow(arrayOf(u.toString()))
            context.grantUriPermission(callingPackage, u, Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        val startPos = chooserIntent.getIntExtra(CURSOR_START_POSITION, -1)
        if (startPos >= 0) {
            var cursorExtras = cursor.extras
            cursorExtras = if (cursorExtras == null) {
                Bundle()
            } else {
                Bundle(cursorExtras)
            }
            cursorExtras.putInt(AdditionalContentContract.CursorExtraKeys.POSITION, startPos)
            cursor.extras = cursorExtras
        }
        return cursor
    }

    override fun call(method: String, arg: String?, extras: Bundle?): Bundle? {
        val context = context ?: return null
        val result = Bundle()
        val customActionFactory = CustomActionFactory(context)

        val chooserIntent =
            extras?.getParcelable(Intent.EXTRA_INTENT, Intent::class.java) ?: return result

        // If the chooser intent has a custom action, make a random number of custom actions each
        // time they change something.
        if (chooserIntent.hasExtra(Intent.EXTRA_CHOOSER_CUSTOM_ACTIONS)) {
            result.putParcelableArray(
                Intent.EXTRA_CHOOSER_CUSTOM_ACTIONS,
                customActionFactory.getCustomActions(Random.nextInt(5))
            )
        }

        // Update alternate intent if the chooser intent has one.
        if (chooserIntent.hasExtra(Intent.EXTRA_ALTERNATE_INTENTS)) {
            chooserIntent.getParcelableExtra(Intent.EXTRA_INTENT, Intent::class.java)
                ?.let { targetIntent ->
                    result.putParcelableArray(
                        Intent.EXTRA_ALTERNATE_INTENTS,
                        arrayOf(createAlternateIntent(targetIntent))
                    )
                }
        }

        if (chooserIntent.hasExtra(Intent.EXTRA_CHOOSER_MODIFY_SHARE_ACTION)) {
            result.setModifyShareAction(
                context,
                chooserIntent.getParcelableExtra(
                    Intent.EXTRA_INTENT,
                    Intent::class.java
                )?.extraStream?.size ?: -1
            )
        }

        if (chooserIntent.hasExtra(Intent.EXTRA_CHOOSER_TARGETS)) {
            result.putParcelableArray(
                Intent.EXTRA_CHOOSER_TARGETS,
                arrayOf(
                    createCallerTarget(
                        context,
                        buildString {
                            append("Modified Caller Target. Shared URIs:")
                            chooserIntent.getParcelableExtra(
                                Intent.EXTRA_INTENT,
                                Intent::class.java
                            )?.extraStream?.forEach {
                                append("\n * $it")
                            }
                        }
                    )
                )
            )
        }

        if (chooserIntent.hasExtra(Intent.EXTRA_CHOOSER_REFINEMENT_INTENT_SENDER)) {
            result.putParcelable(
                Intent.EXTRA_CHOOSER_REFINEMENT_INTENT_SENDER,
                createRefinementIntentSender(context, false)
            )
        }

        val latency = chooserIntent.getIntExtra(EXTRA_SELECTION_LATENCY, 0)
        if (latency > 0) {
            SystemClock.sleep(latency.toLong())
        }

        return result
    }

    override fun query(
        uri: Uri,
        projection: Array<String>?,
        selection: String?,
        selectionArgs: Array<String>?,
        sortOrder: String?,
    ): Cursor? {
        return null
    }

    override fun getType(uri: Uri): String? {
        return null
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return null
    }

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int {
        return 0
    }

    override fun update(
        uri: Uri,
        values: ContentValues?,
        selection: String?,
        selectionArgs: Array<String>?,
    ): Int {
        return 0
    }

    companion object {
        val ADDITIONAL_CONTENT_URI = Uri.parse("content://com.android.sharetest.additionalcontent")
        val CURSOR_START_POSITION = "com.android.sharetest.CURSOR_START_POS"
        val EXTRA_SELECTION_LATENCY = "latency"
    }
}

