package es.ucm.fdi.iw.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import es.ucm.fdi.iw.LocalData;
import es.ucm.fdi.iw.model.Code;
import es.ucm.fdi.iw.model.Map;
import es.ucm.fdi.iw.model.User;

@Controller	
@RequestMapping("admin")
public class AdminController {
	
	private static Logger log = Logger.getLogger(AdminController.class);
	
	@Autowired
	private LocalData localData;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EntityManager entityManager;

    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("s", "../static");
    }

	@GetMapping({"", "/"})
	public String root(Model m) {
		
		m.addAttribute("users", entityManager
				.createQuery("select u from User u").getResultList());
		
		List<Map> maps = entityManager.createQuery("from Map", Map.class).getResultList();
		m.addAttribute("maps", maps);
		
		List<Code> codes = entityManager.createQuery("from Code", Code.class).getResultList();
		m.addAttribute("codes", codes);
		
		return "admin";
	}
	
	@PostMapping(value = "/deleteUsers")
	@ResponseBody
    @Transactional
	public String deleteUsersHandler(@RequestParam("users[]") ArrayList<String> users)
{
		
    	for(String user: users) {
    		if (localData.getFile("/users", user).delete()) {
				User element = entityManager.find(User.class, Long.parseLong(user));
				entityManager.remove(element);
			}
			else
		        log.info("El fichero no pudo ser borrado");
    	}
				
			
			
    	return  "/admin";

	}
    
    	

	@PostMapping(value = "/deleteCodes")
	@ResponseBody
    @Transactional
	public String deleteCodesHandler(@RequestParam("codes[]") ArrayList<String> codes)
{
		
    	for(String code: codes) {
    		if (localData.getFile("/codes", code).delete()) {
				Code element = entityManager.find(Code.class, Long.parseLong(code));
				entityManager.remove(element);
			}
			else
		        log.info("El fichero no pudo ser borrado");
    	}
				
			
			
    	return  "/admin";

	}
	
	@PostMapping(value = "/deleteMaps")
	@ResponseBody
    @Transactional
	public String deleteMapsHandler(@RequestParam("maps[]") ArrayList<String> maps)
{
		
    	for(String map: maps) {
    		if (localData.getFile("/maps", map).delete()) {
				Map element = entityManager.find(Map.class, Long.parseLong(map));
				entityManager.remove(element);
			}
			else
		        log.info("El fichero no pudo ser borrado");
    	}
				
			
			
    	return  "/admin";

	}
    
    
}
