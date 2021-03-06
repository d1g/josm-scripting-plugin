package org.openstreetmap.josm.plugins.scripting.ui.console;

import static org.openstreetmap.josm.tools.I18n.tr;

import java.awt.event.ActionEvent;
import java.io.File;
import java.util.logging.Logger;

import javax.swing.AbstractAction;
import javax.swing.JFileChooser;

import org.openstreetmap.josm.tools.ImageProvider;

public class SaveAsAction extends AbstractAction {
    static private final Logger logger = Logger.getLogger(SaveAsAction.class.getName());

    protected File askFile() {
        JFileChooser chooser = new JFileChooser();
        chooser.setDialogTitle(tr("Select a script"));
        chooser.setFileSelectionMode(JFileChooser.FILES_ONLY);
        chooser.setMultiSelectionEnabled(false);
        chooser.setFileHidingEnabled(false);
        int ret = chooser.showSaveDialog(ScriptingConsole.getInstance());
        if (ret != JFileChooser.APPROVE_OPTION) return null;

        return chooser.getSelectedFile();
    }

    public SaveAsAction() {
        putValue(NAME, tr("Save as ..."));
        putValue(SHORT_DESCRIPTION, tr("Save to a script file"));
        putValue(SMALL_ICON, ImageProvider.get("save_as"));
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        File f = askFile();
        if (f == null) return;
        ScriptingConsole.getInstance().save(f);
    }
}
