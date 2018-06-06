package es.ucm.fdi.iw.controller;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Code;
import es.ucm.fdi.iw.model.Map;

@Controller	
@RequestMapping("admin")
public class AdminController {
	
	private static Logger log = Logger.getLogger(AdminController.class);
	
	@Autowired
	private LocalData localData;
	
	@Autowired
	private EntityManager entityManager;

    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("s", "../static");
        
    	List<Map> maps = entityManager.createQuery("from Map", Map.class).getResultList();
		model.addAttribute("maps", maps);
		
		List<Code> codes = entityManager.createQuery("from Code", Code.class).getResultList();
		model.addAttribute("codes", codes);
    }

	@GetMapping({"", "/"})
	public String root(Model m) {
		return "admin";
	}
	
	@PostMapping(value = "/deleteCodes")
	@ResponseBody
    @Transactional
	public String deleteCodesHandler(@RequestParam("codes[]") ArrayList<String> codes, Model m)
{
		Code element;
    	for(String code: codes) {
			element = entityManager.find(Code.class, Long.parseLong(code));

    		if (localData.getFile("/codes", code).delete()) {
				log.info("Deleting CODE: " + element.getName() + " Result: SUCCESS");
				entityManager.remove(element);
			}
			else
				log.info("Deleting CODE: " + element.getName() + " Result: FAILURE Reason: file not found or unable to read file");
    	}
			
    	return  "/admin";

	}
	
	@PostMapping(value = "/deleteMaps")
	@ResponseBody
    @Transactional
	public String deleteMapsHandler(@RequestParam("maps[]") ArrayList<String> maps, Model m)
{
		Map element;
    	for(String map: maps) {
			element = entityManager.find(Map.class, Long.parseLong(map));

    		if (localData.getFile("/maps", map).delete()) {
				log.info("Deleting MAP: " + element.getName() + " Result: SUCCESS");

				entityManager.remove(element);
			}
			else
				log.info("Deleting MAP: " + element.getName() + " Result: FAILURE Reason: file not found or unable to read file");
    	}
			
    	return  "/admin";

	}

}
